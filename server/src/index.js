import { App } from "./app.js";
import { ConfigService } from "./config/config.service.js";
import { DbService } from "./database/database.service.js";
import { LoggerService } from "./logger/logger.service.js";

function main() {
  const logger = new LoggerService();
  const cfg = new ConfigService();
  const db = new DbService();

  const app = new App(logger, db, cfg);
  app.init();
}

main();
