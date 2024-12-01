import { TableService } from "../../../cron/table";
import { AverageTable } from "../../../cron/table/impl/average-table";
import { CountTable } from "../../../cron/table/impl/count-table";
import { SumTable } from "../../../cron/table/impl/sum-table";
import { createTable } from "./impl/util";

const tableService = new TableService({
  averageTable: new AverageTable(),
  sumTable: new SumTable(),
  countTable: new CountTable(),
});

test("TableService.createAverageTable 테스트", () => {
  const orderInfos = [
    { id: 1, price: 10, km: 5 }, // km 5, cnt 1, sum 10
    { id: 2, price: 20, km: 16 }, // km 20, cnt 2, sum 43
    { id: 2, price: 23, km: 20 },
    { id: 14, price: 190, km: 50 }, // km 50, cnt 1, sum 190
    { id: 16, price: 161, km: 51 }, // km 60, cnt 3, sum 448
    { id: 15, price: 177, km: 55 },
    { id: 11, price: 110, km: 60 },
  ];

  const expectResult = createTable([
    { key: "5KM", value: 10 },
    { key: "20KM", value: 21 },
    { key: "50KM", value: 190 },
    { key: "60KM", value: 149 },
  ]);
  const result = tableService.createAverageTable(orderInfos);

  expect(result).toStrictEqual(expectResult);
});
