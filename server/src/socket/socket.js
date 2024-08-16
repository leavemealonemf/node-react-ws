import { WebSocketServer } from "ws";
import { EventEmitter } from "events";

const WSS_MESSAGES_SIZE_LIMIT = 9; // msg's max count;

export class Socket extends EventEmitter {
  #wss;
  #wssMessages;
  #wssMessagesIterationKey = 1;
  #logger;

  constructor(logger, messages) {
    super();
    this.#logger = logger;
    this.#wssMessages = messages;
  }

  createWSServer() {
    this.#wss = new WebSocketServer({
      port: 8080,
    });

    this.#wss.on("connection", (ws) => {
      this.on("sendmsg", (msg) => {
        this.updateMsgStream(msg);
        ws.send(msg);
      });
      this.#logger.log("[WS] New connection");
    });

    this.#wss.on("error", (err) => {
      this.#logger.error("[WS]", err);
    });
  }

  updateMsgStream(message) {
    if (this.#wssMessages.size === WSS_MESSAGES_SIZE_LIMIT) {
      this.#wssMessages.remove(
        this.#wssMessagesIterationKey - WSS_MESSAGES_SIZE_LIMIT
      );
    }

    this.#wssMessages.add(this.#wssMessagesIterationKey, message);
    this.#wssMessagesIterationKey += 1;
  }
}
