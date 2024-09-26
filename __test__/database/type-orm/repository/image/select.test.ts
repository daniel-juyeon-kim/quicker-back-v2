import { initializeDataSource } from "../../../../../database/type-orm";
import { ImageRepository } from "../../../../../database/type-orm/repository/impl/image.repository";
import { UserRepository } from "../../../../../database/type-orm/repository/impl/user.repository";
import { testAppDataSource } from "../data-source";

const hash = "아이디";
const birthDate = {
  id: hash,
  year: 2000,
  month: 9,
  date: 12,
};
const user = {
  id: hash,
  wallet_address: "지갑주소",
  name: "이름",
  email: "이메일@gmail.com",
  contact: "연락처",
};
const userRepository = new UserRepository(testAppDataSource);

const imageRepository = new ImageRepository(testAppDataSource);

beforeAll(async () => {
  await initializeDataSource(testAppDataSource);
});

beforeEach(async () => {
  await userRepository.createUser({ user, birthDate, hash });
});

describe("findImageIdByUserId 테스트", () => {
  test("정상흐름", async () => {
    await expect(imageRepository.findImageIdByUserId("아이디")).resolves.toEqual({ imageId: "404" });
  });
});
