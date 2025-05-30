import { Request, Response } from "express";
import { HttpErrorResponse } from "../../../../util/http-response";
import { validate } from "../../../../validator";
import {
  createUserSchema,
  UserControllerRequestData,
} from "../../../../validator/schema/routes/user/user-controller-request-data";

let req: Partial<Request>;
let res: Partial<Response>;
const next = jest.fn();

beforeEach(() => {
  req = { query: {}, body: {} };
  res = { send: jest.fn() };
  next.mockClear();
});

describe("POST: /user", () => {
  const runValidate = validate(createUserSchema, ["body"]);

  describe("통과하는 테스트", () => {
    test("유효한 요청", async () => {
      const body: UserControllerRequestData["createUser"] = {
        walletAddress: "0xABC123",
        name: "John Doe",
        email: "john@example.com",
        contact: "01012341234",
        birthDate: "2000/01/01",
      };
      req.body = body;

      await runValidate(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe("실패하는 테스트", () => {
    test("잘못된 이메일 형식", async () => {
      const body: UserControllerRequestData["createUser"] = {
        walletAddress: "0xABC123",
        name: "John Doe",
        email: "invalid-email",
        contact: "01012341234",
        birthDate: "2000/01/01",
      };
      req.body = body;

      await runValidate(req as Request, res as Response, next);

      expect(res.send).toHaveBeenCalledWith(
        new HttpErrorResponse(400, [
          {
            location: "body",
            msg: "이메일 형식 이어야 합니다.",
            path: "email",
            type: "field",
            value: "invalid-email",
          },
        ]),
      );
    });

    test("필수 속성 누락", async () => {
      req.body = {
        name: "John Doe",
        birthDate: "2000/01/01",
      };

      await runValidate(req as Request, res as Response, next);

      expect(res.send).toHaveBeenCalledWith(
        new HttpErrorResponse(400, [
          {
            location: "body",
            msg: "데이터가 존재하지 않습니다.",
            path: "walletAddress",
            type: "field",
            value: undefined,
          },
          { location: "body", msg: "문자열 이어야 합니다.", path: "walletAddress", type: "field", value: undefined },
          { location: "body", msg: "데이터가 존재하지 않습니다.", path: "email", type: "field", value: undefined },
          { location: "body", msg: "문자열 이어야 합니다.", path: "email", type: "field", value: undefined },
          { location: "body", msg: "이메일 형식 이어야 합니다.", path: "email", type: "field", value: undefined },
          { location: "body", msg: "데이터가 존재하지 않습니다.", path: "contact", type: "field", value: undefined },
          { location: "body", msg: "문자열 이어야 합니다.", path: "contact", type: "field", value: undefined },
          { location: "body", msg: "전화번호 형식 이어야 합니다.", path: "contact", type: "field", value: undefined },
        ]),
      );
    });

    test("빈 문자열 필드", async () => {
      const body: UserControllerRequestData["createUser"] = {
        walletAddress: "0xABC123",
        name: "",
        email: "invalid-email",
        contact: "01012341234",
        birthDate: "2000/01/01",
      };
      req.body = body;

      await runValidate(req as Request, res as Response, next);

      expect(res.send).toHaveBeenCalledWith(
        new HttpErrorResponse(400, [
          { location: "body", msg: "데이터가 존재하지 않습니다.", path: "name", type: "field", value: "" },
          { location: "body", msg: "이메일 형식 이어야 합니다.", path: "email", type: "field", value: "invalid-email" },
        ]),
      );
    });

    test("잘못된 전화번호 형식", async () => {
      const body: UserControllerRequestData["createUser"] = {
        walletAddress: "0xABC123",
        name: "",
        email: "invalid-email",
        contact: "not-a-phone-number",
        birthDate: "2000/01/01",
      };
      req.body = body;

      await runValidate(req as Request, res as Response, next);

      expect(res.send).toHaveBeenCalledWith(
        new HttpErrorResponse(400, [
          { location: "body", msg: "데이터가 존재하지 않습니다.", path: "name", type: "field", value: "" },
          { location: "body", msg: "이메일 형식 이어야 합니다.", path: "email", type: "field", value: "invalid-email" },
          {
            location: "body",
            msg: "전화번호 형식 이어야 합니다.",
            path: "contact",
            type: "field",
            value: "not-a-phone-number",
          },
        ]),
      );
    });

    test("경계값: 태어난 연도 최소값", async () => {
      const body: UserControllerRequestData["createUser"] = {
        walletAddress: "0xABC123",
        name: "이름",
        email: "valid-email@email.com",
        contact: "01012341234",
        birthDate: "2023/01/01",
      };
      req.body = body;

      await runValidate(req as Request, res as Response, next);

      // 가정: 연도에 대한 최소값 검증 실패 시의 처리

      expect(res.send).toHaveBeenCalledWith(
        new HttpErrorResponse(400, [
          {
            location: "body",
            msg: "날자 형식 이어야 합니다.",
            path: "birthDate",
            type: "field",
            value: "2023/01/01",
          },
        ]),
      );
    });
  });
});
