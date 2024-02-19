const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

class Whatsapp {
  client;
  qr;
  status;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth(),
    });
    this.qr = "";
    this.status = "pending";

    this.client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
      this.qr = qr;
    });

    this.client.on("ready", () => {
      console.log("Client is ready!");
      this.status = "ready";
    });
  }

  start() {
    this.client.initialize();
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
