import { join } from "node:path";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { CustomNamingStrategy } from "../../../../database/type-orm/util/custom-naming-strategy";

const ENTITY_PATH = join(`${__dirname}/../../../../database/type-orm/entity/*.entity.ts`);

export const testDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  entities: [ENTITY_PATH],
  synchronize: true,
  namingStrategy: new CustomNamingStrategy(),
  logging: true,
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
