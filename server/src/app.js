import http from "http";
import { ConfigService } from "./config/config.service";
import { LoggerService } from "./logger/logger.service";

export class App {
  #logger;
  #config;
  #portHttp;
  #host;

  constructor() {
    this.#config = new ConfigService();
    this.#logger = new LoggerService();

    this.#portHttp = Number(this.#config.get("PORT")) || 3001;
    this.#host = this.#config.get("HOST");
  }

  init() {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end("okay");
    });
    server.listen();
    server.on("connect", () => {
      this.#logger.log(
        `[App] HTTP Server started on host: ${this.#host}:${this.#portHttp}`
      );
    });
  }
}
