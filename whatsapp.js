const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

class Whatsapp {
  client;
  qr;
  status;

  constructor() {
    this.client = new Client();
    this.qr = "";
    this.status = "pending";

    this.client.on("qr", (qr) => {
      //   console.log("QR Received", qr);
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
}

module.exports = Whatsapp;
