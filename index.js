const express = require("express");
const Whatsapp = require("./whatsapp");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 3000;
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

let whatsapp = new Whatsapp(io);

app.get("/", (req, res) => {
  res.send("Hello World!");
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

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  if (whatsapp.getQR() !== "") {
    io.emit("qr", whatsapp.getQR());
    whatsapp.status = "waiting for scan";
  }

  io.emit("message", "connected to whatsapp server");
  io.emit("status", whatsapp.getStatus());

  socket.on("start", () => {
    if (whatsapp.getStatus() !== "pending") return;
    console.log("starting whatsapp");
    whatsapp.start();
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
