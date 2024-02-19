const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

class Whatsapp {
  client;
  qr;
  status;
  io;

  constructor(io) {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });
    this.qr = "";
    this.status = "pending";
    this.io = io;

    this.client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
      this.qr = qr;
      this.status = "waiting for scan";

      this.io.emit("qr", qr);
      this.io.emit("status", "waiting for scan");
    });

    this.client.on("ready", () => {
      console.log("Client is ready!");
      this.status = "ready";

      this.io.emit("status", "ready");
    });
  }

  start() {
    this.client.initialize();
    this.status = "initializing";
    this.io.emit("status", this.status);
  }

  getQR() {
    return this.qr;
  }

  getStatus() {
    return this.status;
  }

  sendMessage(number, message) {
    this.client.sendMessage(`${number}@c.us`, message);
  }
}

module.exports = Whatsapp;
