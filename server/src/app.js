import http from "node:http";
import { WebSocketServer } from "ws";
import { ConfigService } from "./config/config.service.js";
import { LoggerService } from "./logger/logger.service.js";

const WSS_MESSAGES_SIZE_LIMIT = 9; // limt msgs;

export class App {
  #logger;
  #config;
  #portHttp;
  #host;
  #server;
  #wss;
  #wssMessages;
  #wssMessagesIterationKey = 1;

  constructor() {
    this.#config = new ConfigService();
    this.#logger = new LoggerService();

    this.#portHttp = Number(this.#config.get("PORT")) || 3001;
    this.#host = this.#config.get("HOST");

    this.#wssMessages = new Map();
  }

  configureHTTP() {
    this.#server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify("ok"));
    });
    this.#server.listen(this.#portHttp, this.#host);
    this.#logger.log(
      `[App] HTTP Server started on host: ${this.#host}:${this.#portHttp}`
    );
  }

  configureWS() {
    this.#wss = new WebSocketServer({
      port: 8080,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024, // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
      },
    });

    this.#wss.on("connection", (ws) => {
      ws.on("message", (message) => {
        if (this.#wssMessages.size === WSS_MESSAGES_SIZE_LIMIT) {
          this.#wssMessages.delete(
            this.#wssMessagesIterationKey - WSS_MESSAGES_SIZE_LIMIT
          );
        }

        this.#wssMessages.set(
          this.#wssMessagesIterationKey,
          message.toString()
        );

        ws.send(message);
        this.#wssMessagesIterationKey += 1;
      });
    });
  }

  init() {
    this.configureHTTP();
    this.configureWS();
  }
}
