import { mock, mockReset } from "jest-mock-extended";
import { KeyCreator } from "../../../core/key-creator";

import { DuplicatedDataError, NotExistDataError } from "../../../database";
import { UserRepository } from "../../../database/type-orm/repository/impl/user/user.repository";
import { UserServiceImpl } from "../../../service/user/user.service.impl";

const repository = mock<UserRepository>();
const dbUserPkCreator = mock<KeyCreator>();
const service = new UserServiceImpl({ repository, dbUserPkCreator });

beforeEach(async () => {
  mockReset(repository);
});

describe("UserServiceImpl 테스트", () => {
  describe("createUser 테스트", () => {
    const body = {
      walletAddress: "지갑주소",
      name: "이름",
      email: "이메일",
      contact: "연락처",
      birthDate: "2000/01/01",
    };

    test("통과하는 테스트", async () => {
      await service.createUser(body);

      expect(repository.create).toHaveBeenCalledWith({
        id: undefined,
        birthDate: new Date(2000, 0, 1),
        user: {
          contact: "연락처",
          email: "이메일",
          name: "이름",
          walletAddress: "지갑주소",
        },
      });
    });

    test("실패하는 테스트, 중복 회원 가입", async () => {
      await service.createUser(body);

      expect(repository.create).toHaveBeenCalledWith({
        id: undefined,
        birthDate: new Date(2000, 0, 1),
        user: {
          contact: "연락처",
          email: "이메일",
          name: "이름",
          walletAddress: "지갑주소",
        },
      });

      const ERROR_MESSAGE = `에 해당하는 데이터가 이미 존재합니다.`;
      repository.create.mockRejectedValue(new DuplicatedDataError(ERROR_MESSAGE));

      await expect(service.createUser(body)).rejects.toBeInstanceOf(DuplicatedDataError);
      await expect(service.createUser(body)).rejects.toThrow(ERROR_MESSAGE);
      expect(repository.create).toHaveBeenCalledTimes(3);
    });

    test("실패하는 테스트", async () => {
      const body = {
        walletAddress: "지갑주소",
        name: "이름",
        email: "이메일",
        contact: "연락처",
        birthDate: "2000/01/01",
      };

      await service.createUser(body);

      expect(repository.create).toHaveBeenCalledWith({
        id: undefined,
        birthDate: new Date(2000, 0, 1),
        user: {
          contact: "연락처",
          email: "이메일",
          name: "이름",
          walletAddress: "지갑주소",
        },
      });
    });
  });

  describe("findUserNameByWalletAddress 테스트", () => {
    test("통과하는 테스트", async () => {
      const walletAddress = "지갑주소";
      const expectReturnValue = { name: "이름" };
      repository.findNameByWalletAddress.mockResolvedValue(expectReturnValue);

      await expect(service.findUserNameByWalletAddress(walletAddress)).resolves.toEqual(expectReturnValue);
      expect(repository.findNameByWalletAddress).toHaveBeenCalledWith("지갑주소");
    });

    test("실패하는 테스트, 존재하지 않는 지갑주소", async () => {
      const walletAddress = "존재하지 않는 지갑주소";

      const ERROR_MESSAGE = `지갑주소 ${walletAddress}에 대응되는 데이터가 존재하지 않습니다.`;
      repository.findNameByWalletAddress.mockRejectedValue(new NotExistDataError(ERROR_MESSAGE));

      await expect(service.findUserNameByWalletAddress(walletAddress)).rejects.toBeInstanceOf(NotExistDataError);
      expect(repository.findNameByWalletAddress).toHaveBeenCalledTimes(1);

      await expect(service.findUserNameByWalletAddress(walletAddress)).rejects.toThrow(ERROR_MESSAGE);
      expect(repository.findNameByWalletAddress).toHaveBeenCalledTimes(2);
    });
  });

  describe("findUserImageId 테스트", () => {
    test("통과하는 테스트", async () => {
      const walletAddress = "지갑주소";
      const expectReturnValue = { imageId: "300" };
      repository.findUserProfileImageIdByWalletAddress.mockResolvedValue(expectReturnValue);

      const imageId = await service.findUserImageId(walletAddress);

      expect(imageId).toEqual(expectReturnValue);
      expect(repository.findUserProfileImageIdByWalletAddress).toHaveBeenCalledWith(walletAddress);
    });

    test("실패하는 테스트, 존재하지 않는 지갑주소", async () => {
      const walletAddress = "존재하지 않는 지갑주소";
      repository.findUserProfileImageIdByWalletAddress.mockRejectedValue(new NotExistDataError(""));

      await expect(service.findUserImageId(walletAddress)).rejects.toThrow(NotExistDataError);
    });
  });

  describe("updateUserImageId 테스트", () => {
    test("통과하는 테스트", async () => {
      const body = { walletAddress: "지갑주소", imageId: "100" };

      await service.updateUserImageId(body);

      expect(repository.updateUserProfileImageIdByWalletAddress).toHaveBeenCalledWith(body);
    });

    test("실패하는 테스트, 존재하지 않는 지갑주소", async () => {
      const body = { walletAddress: "존재하지 않는 지갑주소", imageId: "100" };
      repository.updateUserProfileImageIdByWalletAddress.mockRejectedValue(new NotExistDataError(""));

      await expect(service.updateUserImageId(body)).rejects.toThrow(NotExistDataError);
    });
  });
});
