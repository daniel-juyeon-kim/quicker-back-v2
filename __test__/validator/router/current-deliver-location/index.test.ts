import { NextFunction, Request, Response } from "express";
import { DATA, mustBe, TYPE, validate, ValidationLayerError } from "../../../../validator";
import {
  getCurrentDeliverLocationSchema,
  postCurrentDeliverLocationSchema,
} from "../../../../validator/schema/routes/current-deliver-location";
import { TestName } from "../types/test-name";

let req: Partial<Request>;
let res: Partial<Response>;
let next: NextFunction;

beforeEach(() => {
  req = {};
  res = {};
  next = jest.fn();
});

describe("GET: /current-deliver-location", () => {
  const testTarget = validate(getCurrentDeliverLocationSchema, ["query"]);

  describe(TestName.VALID_REQUSET, () => {
    test(TestName.PASS, async () => {
      req.query = {
        quicker: "1",
      };

      await testTarget(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe(TestName.INVALID_REQUSET, () => {
    test(TestName.NOT_EXIST_ATTRIBUTE, async () => {
      req.query = {};

      await testTarget(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationLayerError({
          location: "query",
          msg: DATA.NOT_EXIST,
          path: "quicker",
          type: "field",
          value: "",
        }),
      );
    });
  });
});

describe("POST: /current-deliver-location", () => {
  const testTarget = validate(postCurrentDeliverLocationSchema, ["body"]);

  describe(TestName.VALID_REQUSET, () => {
    test(TestName.PASS, async () => {
      req.body = {
        X: 1,
        Y: 2,
        address: "fadsf",
      };

      await testTarget(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe(TestName.INVALID_REQUSET, () => {
    test(TestName.MISS_TYPE, async () => {
      req.body = {
        X: 1,
        Y: "2",
        address: "0xi2o124120082yjl3803",
      };

      await testTarget(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationLayerError({
          location: "body",
          msg: mustBe(TYPE.INTEGER),
          path: "Y",
          type: "field",
          value: "2",
        }),
      );
    });

    test(TestName.NOT_EXIST_ATTRIBUTE, async () => {
      req.body = {
        X: 1,
        Y: 2,
      };

      await testTarget(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(
        new ValidationLayerError({
          location: "body",
          msg: DATA.NOT_EXIST,
          path: "address",
          type: "field",
          value: "",
        }),
      );
    });
  });
});
