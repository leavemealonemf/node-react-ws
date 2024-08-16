export class DbService {
  get messages() {
    return new MessagesDb();
  }
}

class MessagesDb {
  #messages;
  constructor() {
    this.#messages = new Map();
  }

  getAll() {
    const msgs = [];

    this.#messages.forEach((v, k) => {
      msgs.push({
        id: k,
        msg: v,
      });
    });

    return msgs;
  }

  add(k, v) {
    this.#messages.set(k, v);
  }

  remove(k) {
    this.#messages.delete(k);
  }
}
