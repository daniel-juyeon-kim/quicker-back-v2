import { AverageCostRepository, AverageOfCost, NotExistDataError } from "../../../../../database";
import { initializeDataSource, testDataSource } from "../data-source";

const averageRepository = new AverageCostRepository(testDataSource.getRepository(AverageOfCost));

beforeAll(async () => {
  await initializeDataSource(testDataSource);
});

afterEach(async () => {
  await testDataSource.manager.clear(AverageOfCost);
});

describe("createAverage 테스트", () => {
  test("통과하는 테스트", async () => {
    const createDate = new Date(1990, 0, 1, 0, 0, 0, 0);
    const average = {
      date: createDate,
      "5KM": 5,
      "10KM": 10,
      "15KM": 15,
      "20KM": 20,
      "25KM": 25,
      "30KM": 30,
      "40KM": 40,
      "50KM": 50,
      "60KM": 60,
      "60+KM": 70,
    };

    await averageRepository.createAverage(average);

    await expect(testDataSource.manager.existsBy(AverageOfCost, { date: createDate })).resolves.toBe(true);
  });
});
describe("findLastMonthAverageCost 테스트", () => {
  beforeEach(async () => {
    const average1: AverageOfCost = {
      date: new Date(1993, 0, 1),
      "5KM": 5,
      "10KM": 10,
      "15KM": 15,
      "20KM": 20,
      "25KM": 25,
      "30KM": 30,
      "40KM": 40,
      "50KM": 50,
      "60KM": 60,
      "60+KM": 70,
    };

    const average2: AverageOfCost = {
      date: new Date(1993, 1, 1),
      "5KM": 329,
      "10KM": 4259,
      "15KM": 11923,
      "20KM": 23491,
      "25KM": 32489,
      "30KM": 32498,
      "40KM": 34982,
      "50KM": 34329,
      "60KM": 45903,
      "60+KM": 45098,
    };

    await testDataSource.manager.save(AverageOfCost, [average1, average2]);
  });

  afterEach(async () => {
    await testDataSource.manager.clear(AverageOfCost);
  });

  test("통과하는 테스트", async () => {
    const lastMonth = new Date(1993, 1, 1);
    const distanceUnit = "40KM";
    await expect(averageRepository.findAverageCostByDateAndDistanceUnit({ distanceUnit, lastMonth })).resolves.toEqual(
      34982,
    );
  });

  describe("실패하는 테스트", () => {
    test("값이 존재하지 않음", async () => {
      const lastMonth = new Date(1993, 3, 1);
      const distanceUnit = "40KM";

      await expect(
        averageRepository.findAverageCostByDateAndDistanceUnit({ distanceUnit, lastMonth }),
      ).rejects.toStrictEqual(new NotExistDataError(`${lastMonth}에 해당되는 데이터가 존재하지 않습니다.`));
    });
  });
});