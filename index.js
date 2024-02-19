const express = require("express");
const Whatsapp = require("./whatsapp");
const app = express();
const port = 3000;

let whatsapp = null;

app.get("/", (req, res) => {
  whatsapp = new Whatsapp();

  try {
    whatsapp.start();
    res.send("Whatsapp started");
  } catch (error) {
    console.log(error);
    res.send("Error starting Whatsapp");
  }
});

app.get("/qr", (req, res) => {
  res.send(whatsapp.getQR());
});

app.get("/status", (req, res) => {
  res.send(whatsapp.getStatus());
});

app.get("/send", (req, res) => {
  let status = whatsapp.getStatus();

  if (status !== "ready") {
    res.send("Whatsapp is not ready");
  }

  res.send(`
        <form action="/send-message" method="get">
            <input type="text" name="number" placeholder="Number">
            <input type="text" name="message" placeholder="Message">
            <button type="submit">Send</button>
        </form>
    `);
});

app.get("/send-message", (req, res) => {
  const number = req.query.number;
  const message = req.query.message;

  if (!number || !message) {
    res.send("Invalid number or message");
  }

  whatsapp.sendMessage(number, message);
  res.send(`Sending message to ${number}: ${message}`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
