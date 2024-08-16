import { config } from "dotenv";
import { LoggerService } from "../logger/logger.service";

export class ConfigService {
  #logger;
  constructor() {
    this.#logger = new LoggerService();
    const result = config();
    if (result.error) {
      this.#logger.error("[ConfigService] Не удалось прочитать файл .env");
    } else {
      this.#logger.log("[ConfigService] Конфиг .env загружен");
      this.config = result.parsed;
    }
  }

  get(key) {
    return this.config[key];
  }
}
