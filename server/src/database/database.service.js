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

  get size() {
    return this.#messages.size;
  }

  all() {
    const messages = [];
    this.#messages.forEach((v, k) => {
      messages.push({
        id: k,
        msg: v,
      });
    });

    return messages;
  }

  add(k, v) {
    this.#messages.set(k, v);
  }

  remove(k) {
    this.#messages.delete(k);
  }
}
