import { initializeDataSource } from "../../../../database/type-orm";
import { studyDataSource } from "./connector/data-source";
import { Profile } from "./entity/profile.entity";
import { UserMetaData } from "./entity/user-meta-data.entity";
import { User } from "./entity/user.entity";

const family = {
  familyName: "가족이름",
  name: "조상",
  parent: {
    name: "부모",
    child: {
      familyName: "가족이름",
      name: "자식",
    },
  },
};

const createFamily = async () => {
  const grandParentFamily = studyDataSource.manager.create(GrandParent, family);
  await studyDataSource.manager.save(GrandParent, grandParentFamily);
};

const removeFamily = async () => {
  await studyDataSource.manager.delete(Child, "가족이름");
};

const user = {
  id: 1,
  name: "이름",
  profile: {
    gender: "성별",
    photo: "photo image",
  },
  metaData: {
    isLogin: true,
  },
};

const createUser = async () => {
  const userEntity = studyDataSource.manager.create(User, user);
  await studyDataSource.manager.save(User, userEntity);
};

const removeUser = async () => {
  await studyDataSource.manager.delete(Profile, { gender: "성별" });
  await studyDataSource.manager.delete(UserMetaData, { isLogin: true });
};

beforeAll(async () => {
  await initializeDataSource(studyDataSource);
});

beforeEach(async () => {
  await createUser();
  await createFamily();
});

afterEach(async () => {
  await removeUser();
  await removeFamily();
});

describe("삭제 테스트", () => {
  describe("delete 메서드 테스트", () => {
    test("엔티티의 primary 값으로 삭제", async () => {
      const result = await studyDataSource.manager.delete(User, 1);
      console.log(result);

      await expect(studyDataSource.manager.existsBy(User, { id: 1 })).resolves.toBe(false);
    });

    test("엔티티의 primary 값을 여러개로 여러 데이터 삭제", async () => {
      await studyDataSource.manager.delete(User, [1]);

      await expect(studyDataSource.manager.existsBy(User, { id: 1 })).resolves.toBe(false);
    });

    test("다른 속성의 값으로 삭제", async () => {
      await studyDataSource.manager.delete(User, { name: "이름" });

      await expect(studyDataSource.manager.existsBy(User, { id: 1 })).resolves.toBe(false);
    });

    test("cascade로 삭제", async () => {
      // 관계의 주인이되는 엔티티에 OneToOne, JoinColumn을 설정한다.
      // 이때 delete를 할 때 부모엔티티가 아닌 자식 엔티티를 제거해야 부모 엔티티와 같이 제거된다.
      // 양방향 단방향 1:1 모두 같다.
      await studyDataSource.manager.delete(Profile, 1);

      await expect(studyDataSource.manager.existsBy(User, { id: 1 })).resolves.toBe(false);
      await expect(studyDataSource.manager.existsBy(Profile, { id: 1 })).resolves.toBe(false);
    });

    test("cascade로 삭제2", async () => {
      // 부모 엔티티 1개와 자식 엔티티 2개를 cascade로 삭제할 때
      // 자식 엔티티로 제거하면 부모-자식1은 제거되지만 자식2는 제거되지 않으므로 별도로 제거해줘야 한다.
      await studyDataSource.manager.delete(Profile, 1);

      await expect(studyDataSource.manager.existsBy(User, { id: 1 })).resolves.toBe(false);
      await expect(studyDataSource.manager.existsBy(Profile, { id: 1 })).resolves.toBe(false);
      await expect(studyDataSource.manager.existsBy(UserMetaData, { id: 1 })).resolves.toBe(true);
    });
  });

  describe("remove 메서드 테스트", () => {
    test("cascade로 삭제", async () => {
      // create메서드는 엔티티의 일부 속성만 있어도 생성 가능하며 save, remove 등에 사용됨
      const profile = studyDataSource.manager.create(Profile, { id: 1 });

      // remove메서드로 삭제를 하기 위해서는 엔티티의 인스턴스를 인자로 넘겨야 한다.
      await studyDataSource.manager.remove(profile);

      await expect(studyDataSource.manager.existsBy(Profile, { id: 1 })).resolves.toBe(false);
      await expect(studyDataSource.manager.existsBy(UserMetaData, { id: 1 })).resolves.toBe(true);
    });
  });
});

import { Child } from "./entity/child.entity";
import { GrandParent } from "./entity/grandparent.entity";
import { Parent } from "./entity/parent.entity";

describe("1:1 연속 cascade 테스트", () => {
  test("삭제 테스트 ", async () => {
    // 최하위 엔티티 제거로 최상위 엔티티까지 전부 제거
    await studyDataSource.manager.delete(Child, { name: "자식" });

    await expect(studyDataSource.manager.existsBy(Child, { familyName: "가족이름" })).resolves.toBe(false);
    await expect(studyDataSource.manager.existsBy(Parent, { familyName: "가족이름" })).resolves.toBe(false);
    await expect(studyDataSource.manager.existsBy(GrandParent, { familyName: "가족이름" })).resolves.toBe(false);
  });
});
