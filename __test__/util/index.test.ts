import fetch from "node-fetch";

import {
  isEmptyArray,
  isEmptyString,
  isFulfilled,
  isNull,
  isNumber,
  isPositiveNumber,
  isString,
  isUndefined,
  validateNotZero,
  validateNumeric,
  validateResponse,
} from "../../util";

describe("isUndefined 테스트", () => {
  test("통과", () => {
    const result = isUndefined(undefined);

    expect(result).toBe(true);
  });

  test("실패하는 테스트", () => {
    ["", "env", 3].forEach((value) => {
      const result = isUndefined(value);

      expect(result).toBe(false);
    });
  });
});

describe("isNumber 테스트", () => {
  test("통과", () => {
    const result = isNumber(1);

    expect(result).toBe(true);
  });

  test("실패하는 테스트", () => {
    const testCases = [-Infinity, NaN, Infinity];

    testCases.forEach((value) => expect(isNumber(value)).toBe(false));
  });
});

describe("isPositiveNumber 테스트", () => {
  test("통과", () => {
    const result = isPositiveNumber(1);

    expect(result).toBe(true);
  });

  test("실패하는 테스트", () => {
    [0, NaN].forEach((value) => {
      const result = isPositiveNumber(value);

      expect(result).toBe(false);
    });
  });
});

describe("isString 테스트", () => {
  test("통과", () => {
    expect(isString("")).toBe(true);
  });

  test("실패하는 테스트", () => {
    [1, NaN, {}].forEach((value) => {
      const result = isString(value);

      expect(result).toBe(false);
    });
  });
});

describe("isEmptyString 테스트", () => {
  test("통과", () => {
    expect(isEmptyString("")).toBe(true);
  });

  test("실패하는 테스트", () => {
    ["asdf", "d"].forEach((value) => {
      const result = isEmptyString(value);

      expect(result).toBe(false);
    });
  });
});

describe("isFulfilled 테스트", () => {
  test("통과", () => {
    const result = isFulfilled({ status: "fulfilled", value: "값" });

    expect(result).toBe(true);
  });

  test("싪패", () => {
    const result = isFulfilled({ status: "rejected", reason: "값" });

    expect(result).toBe(false);
  });
});

describe("isNull 테스트", () => {
  test("통과", () => {
    expect(isNull(null)).toBe(true);
  });

  test("실패하는 테스트", () => {
    [undefined, 0, false, -1, {}, []].forEach((value) => {
      expect(isNull(value)).toBe(false);
    });
  });
});

describe("validateResponse 테스트", () => {
  test("통과", () => {
    const response = { status: 200 } as fetch.Response;

    expect(async () => {
      await validateResponse(response);
    }).not.toThrow();
  });

  test("실패하는 테스트", async () => {
    const json = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          resolve({ body: "errorBody" });
          reject(undefined);
        }),
    );

    const testCases = [
      { status: 199, json },
      { status: 201, json },
    ] as unknown as fetch.Response[];

    testCases.forEach(async (testCase) => {
      await expect(validateResponse(testCase)).rejects.toStrictEqual({ body: "errorBody" });
      expect(json).toHaveBeenCalled();
    });
  });
});

describe("validateNumeric 테스트", () => {
  test("통과", () => {
    const testCases = [-1, 1, "-1", "1"];

    testCases.forEach((testCase) => expect(() => validateNumeric(testCase)).not.toThrow());
  });

  test("실패하는 테스트", () => {
    const testCases = [Infinity, NaN, -Infinity];

    testCases.forEach((testCase) => expect(() => validateNumeric(testCase)).toThrow());
  });
});

describe("validateNotZero 테스트", () => {
  test("통과", () => {
    const testCases = [-1, 1];

    testCases.forEach((testCase) => expect(() => validateNotZero(testCase)).not.toThrow());
  });

  test("실패하는 테스트", () => {
    expect(() => validateNotZero(0)).toThrow("값이 0입니다.");
  });
});

describe("isEmptyArray 테스트", () => {
  test("통과하는 테스트", () => {
    expect(isEmptyArray([])).toBe(true);
  });

  test("실패하는 테스트", () => {
    expect(isEmptyArray([1])).toBe(false);
  });
});
