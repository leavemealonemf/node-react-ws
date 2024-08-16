import http from "node:http";
import { ConfigService } from "./config/config.service.js";
import { LoggerService } from "./logger/logger.service.js";
import { Socket } from "./socket/socket.js";
import { DbService } from "./database/database.service.js";

export class App {
  #logger;
  #config;
  #portHttp;
  #host;
  #server;
  #socket;

  constructor() {
    this.#config = new ConfigService();
    this.#logger = new LoggerService();

    this.#socket = new Socket();

    this.#portHttp = Number(this.#config.get("PORT")) || 3001;
    this.#host = this.#config.get("HOST");
  }

  serveHTTP() {
    this.#server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });

      if (req.method === "POST") {
        console.dir(req["body"]);
      }

      const messages = new DbService().messages.getAll();

      if (!messages) res.end(JSON.stringify(messages));

      res.end(JSON.stringify(messages));

      // res.writeHead(200, { "Content-Type": "application/json" });
      // res.end(JSON.stringify("ok"));
    });
    this.#server.listen(this.#portHttp, this.#host);
    this.#logger.log(
      `[App] HTTP Server started on host: ${this.#host}:${this.#portHttp}`
    );
  }

  init() {
    this.serveHTTP();
    this.#socket.createWSServer();
  }
}
