import { Response } from "node-fetch";

const ZERO = 0;
export type ExcludeEmptyString = Exclude<string, "">;

export const isUndefined = (value: unknown): value is undefined => {
  return value === undefined;
};

export const isNull = (value: unknown) => {
  return value === null;
};

export const isNumber = (value: number): value is number => {
  return Number.isFinite(value);
};

export const isPositiveNumber = (value: number) => {
  return isNumber(value) && isPositive(value);
};

const isPositive = (value: number) => {
  return ZERO < value;
};

export const isString = (value: unknown): value is string => {
  return typeof value === "string";
};

export const isEmptyString = (value: string): value is "" => {
  return value === "";
};

export const isFulfilled = <T>(result: PromiseSettledResult<T>) => {
  return result.status === "fulfilled";
};

export const validateResponse = async (response: Response) => {
  if (isOK(response.status)) {
    return;
  }
  throw await response.json();
};

const isOK = (responseStatus: Response["status"]) => {
  const OK = 200;
  return responseStatus === OK;
};

export const validateNumber = (value: number) => {
  const ERROR_INVALID_NUMBER = "유효한 정수가 아닙니다.";

  if (!isNumber(value)) {
    throw new Error(ERROR_INVALID_NUMBER);
  }
};

export const validateNotZero = (value: number) => {
  const ERROR_VALUE_IS_ZERO = "값이 0입니다.";

  if (isZero(value)) {
    throw new Error(ERROR_VALUE_IS_ZERO);
  }
};

const isZero = (value: number) => {
  return value === ZERO;
};
