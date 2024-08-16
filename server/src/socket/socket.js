import { WebSocketServer } from "ws";
import { LoggerService } from "../logger/logger.service.js";
import { DbService } from "../database/database.service.js";

const WSS_MESSAGES_SIZE_LIMIT = 9; // msg's max count;

export class Socket {
  #wss;
  #wssMessages;
  #wssMessagesIterationKey = 1;
  #logger;

  constructor() {
    this.#logger = new LoggerService();
    this.#wssMessages = new DbService().messages;
  }

  createWSServer() {
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

    this.#wss.on("connection", () => {
      this.#logger.log("[WS] New connection");
    });

    this.#wss.on("error", (err) => {
      this.#logger.error("[WS]", err);
    });
  }

  sendMsg(message) {
    if (this.#wssMessages.size === WSS_MESSAGES_SIZE_LIMIT) {
      this.#wssMessages.remove(
        this.#wssMessagesIterationKey - WSS_MESSAGES_SIZE_LIMIT
      );
    }

    this.#wssMessages.add(this.#wssMessagesIterationKey, message.toString());

    ws.send(message);
    this.#wssMessagesIterationKey += 1;
  }
}
