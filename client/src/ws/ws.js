export class WSConnection {
  static ws;

  static connect() {
    this.ws = new WebSocket("ws://127.0.0.1:8080");
    this.ws.addEventListener("open", () => {
      // socket.send("Hello Server!");
      console.log("opened");
    });
  }

  static disconnect() {
    this.ws.close(1000);
    console.log("connection closed");
  }
}
