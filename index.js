const express = require("express");
const Whatsapp = require("./whatsapp");
const app = express();
const port = 3001;

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

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
