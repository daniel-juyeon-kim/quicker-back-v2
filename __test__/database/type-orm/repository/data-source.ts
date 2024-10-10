import { join } from "node:path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { CustomNamingStrategy } from "../../../../database/type-orm/connector/custom-naming-strategy";

const entityPath = join(`${__dirname}/../../../../database/type-orm/**/*.entity.ts`);

export const testAppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: [entityPath],
  synchronize: true,
  namingStrategy: new CustomNamingStrategy(),
  logging: false,
});

export const initializeDataSource = async (dataSource: DataSource) => {
  try {
    if (dataSource.isInitialized) {
      return;
    }
    await dataSource.initialize();
  } catch (error) {
    console.log(error);
  }
};
