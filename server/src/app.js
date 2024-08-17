import http from "node:http";
import { Socket } from "./socket/socket.js";

export class App {
  #logger;
  #config;
  #portHttp;
  #host;
  #server;
  #db;
  #socket;

  constructor(logger, db, cfg) {
    this.#config = cfg;
    this.#logger = logger;
    this.#db = db.messages;

    this.#socket = new Socket(logger, this.#db);

    this.#portHttp = Number(this.#config.get("PORT")) || 3001;
    this.#host = this.#config.get("HOST");
  }

  serveHTTP() {
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    this.#server = http.createServer((req, res) => {
      if (req.url === "/messages") {
        if (req.method === "POST") {
          let body = "";
          const ctx = this.#socket;

          req.on("data", function (data) {
            body += data;
          });
          req.on("end", function () {
            ctx.emit("sendmsg", body);
            res.writeHead(200, headers);
            res.end(body);
          });
        } else if (req.method === "GET") {
          const messages = this.#db.all();
          res.writeHead(200, headers);
          res.end(JSON.stringify(messages));
        }
      }
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
