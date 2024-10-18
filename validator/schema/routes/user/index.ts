import { Schema } from "express-validator";
import { DATA, FORMAT, mustBe, TYPE } from "../../../error-message";
import { customBirthDateValidator } from "./custom-birth-date-validator";

export interface UserControllerRequestData {
  postUser: {
    walletAddress: string;
    name: string;
    email: string;
    contact: string;
    birthDate: string;
  };

  findUserNameByWalletAddress: { walletAddress: string };

  putUserImageId: { walletAddress: string; imageId: string };

  getUserImageId: { walletAddress: string };
}

const mustBeExistAndString = {
  notEmpty: {
    errorMessage: DATA.NOT_EXIST,
  },
  isString: {
    errorMessage: mustBe(TYPE.STRING),
  },
};

// POST /user
export const postUserSchema: Schema = {
  walletAddress: mustBeExistAndString,
  name: mustBeExistAndString,
  email: {
    ...mustBeExistAndString,
    isEmail: {
      errorMessage: mustBe(FORMAT.EMAIL),
    },
  },
  contact: {
    ...mustBeExistAndString,
    isMobilePhone: {
      errorMessage: mustBe(FORMAT.PHONE_NUMBER),
    },
  },
  birthDate: {
    notEmpty: {
      errorMessage: DATA.NOT_EXIST,
    },
    isDate: {
      errorMessage: mustBe(FORMAT.DATE),
    },
    custom: {
      options: customBirthDateValidator,
      errorMessage: mustBe(FORMAT.DATE),
    },
  },
};

// GET /user/name
export const getUserNameSchema = {
  walletAddress: {
    notEmpty: {
      errorMessage: DATA.NOT_EXIST,
    },
    isString: {
      errorMessage: mustBe(TYPE.STRING),
    },
  },
};

// GET /user/image/id
export const getUserImageIdSchema: Schema = {
  walletAddress: {
    notEmpty: {
      errorMessage: DATA.NOT_EXIST,
    },
    isString: {
      errorMessage: mustBe(TYPE.STRING),
    },
  },
};

// PUT /user/image/id
export const putUserImageIdSchema: Schema = {
  walletAddress: {
    escape: true,
    trim: true,
    notEmpty: {
      errorMessage: DATA.NOT_EXIST,
    },
    isString: {
      errorMessage: mustBe(TYPE.STRING),
    },
  },
  imageId: {
    escape: true,
    trim: true,
    notEmpty: {
      errorMessage: DATA.NOT_EXIST,
    },
    isNumeric: {
      errorMessage: mustBe(TYPE.INTEGER),
    },
    isString: {
      errorMessage: mustBe(TYPE.STRING),
    },
  },
};
