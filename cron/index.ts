import { errorMessageBot } from "../core/instance";
import { CronService } from "./cron-service";
import { dataService } from "./data";
import { tableService } from "./table";

export const cronService = new CronService({ dataService, tableService, errorMessageBot });
