import { NextFunction, Request, Response } from "express";
import { getMethodSchema, postMethodSchema } from "../../../../validator/schema/routes/current-deliver-location";
import { Types, message, validate } from "../../../../validator";
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
  const testTarget = validate(getMethodSchema, ["query"])

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

      expect(next).toHaveBeenCalledWith({
        location: "query",
        msg: message.notExist,
        path: "quicker",
        type: "field",
        value: "",
      });
    });
  });
});

describe("POST: /current-deliver-location", () => {
  const testTarget = validate(postMethodSchema, ["body"])
  
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

      expect(next).toHaveBeenCalledWith({
        location: "body",
        msg: message.mustBe(Types.INT),
        path: "Y",
        type: "field",
        value: "2",
      });
    });

    test(TestName.NOT_EXIST_ATTRIBUTE, async () => {
      req.body = {
        X: 1,
        Y: 2,
      };

      await testTarget(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith({
        location: "body",
        msg: message.notExist,
        path: "address",
        type: "field",
        value: "",
      });
    });
  });
});