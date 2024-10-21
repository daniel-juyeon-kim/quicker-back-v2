import {
  ChatRoomRepository,
  Departure,
  Destination,
  Order,
  Product,
  Transportation,
  User,
} from "../../../../../database/type-orm";
import { initializeDataSource, testAppDataSource } from "../data-source";

const chatRoomRepository = new ChatRoomRepository(testAppDataSource.getRepository(Order));

const createUser = async () => {
  const user = testAppDataSource.manager.create(User, {
    id: "아이디",
    walletAddress: "지갑주소",
    name: "이름",
    email: "이메일",
    contact: "연락처",
    birthDate: {
      id: "아이디",
      date: new Date(2000, 9, 12).toISOString(),
    },
    profileImage: {
      id: "아이디",
      imageId: "111",
    },
    joinDate: {
      id: "아이디",
      date: new Date(2023, 9, 12).toISOString(),
    },
  });

  await testAppDataSource.manager.save(User, user);
};

const createOrder = async (requester: User) => {
  const detail = "디테일";
  const product = {
    width: 0,
    length: 0,
    height: 0,
    weight: 0,
  };
  const transportation = {
    walking: 0,
    bicycle: 0,
    scooter: 0,
    bike: 0,
    car: 0,
    truck: 0,
  };
  const destination = {
    x: 37.5,
    y: 112,
    detail: "디테일",
  };
  const recipient = {
    name: "이름",
    phone: "01012345678",
  };
  const departure = {
    x: 0,
    y: 0,
    detail: "디테일",
  };
  const sender = {
    name: "이름",
    phone: "01012345678",
  };
  await testAppDataSource.transaction(async (manager) => {
    const order = manager.create(Order, {
      detail,
      requester,
    });

    await manager.save(Order, order);

    const id = order.id;

    await manager.save(Product, {
      id,
      ...product,
      order: order,
    });
    await manager.save(Transportation, {
      id,
      ...transportation,
      order: order,
    });
    await manager.save(Destination, {
      id,
      ...destination,
      order: order,
      recipient: {
        id,
        ...recipient,
      },
    });
    await manager.save(Departure, {
      id,
      ...departure,
      order: order,
      sender: {
        id,
        ...sender,
      },
    });
  });
};

beforeAll(async () => {
  await initializeDataSource(testAppDataSource);
  await createUser();
});

beforeEach(async () => {
  const user = (await testAppDataSource.manager.findOneBy(User, { id: "아이디" })) as User;
  await createOrder(user);
});

afterEach(async () => {
  await testAppDataSource.manager.clear(Order);
});

describe("findChatParticipantByOrderId 테스트", () => {
  test("통과하는 테스트", async () => {
    const orderId = 1;

    await expect(chatRoomRepository.findChatParticipantByOrderId(orderId)).resolves.toEqual({
      id: orderId,
      departure: {
        id: orderId,
        x: 0,
        y: 0,
        sender: { phone: "01012345678" },
      },
      destination: {
        id: orderId,
        x: 37.5,
        y: 112,
        recipient: { phone: "01012345678" },
      },
    });
  });

  test("실패하는 테스트, 존재하지 않는 주문 아이디 입력", async () => {
    await expect(chatRoomRepository.findChatParticipantByOrderId(32)).rejects.toThrow("데이터가 존재하지 않습니다.");
  });
});
