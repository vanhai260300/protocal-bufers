const express = require("express");
const bodyParser = require("body-parser");
const protobuf = require("protobufjs");
const app = express();
const PORT = 3001;

// Load the protobuf definition
const User = protobuf.loadSync("user.proto").lookupType("User");

app.use(bodyParser.json());

let users = {};

app.post("/user", (req, res) => {
  const payload = req.body;

  const errMsg = User.verify(payload);
  if (errMsg) return res.status(400).send(errMsg);

  const user = User.create(payload);
  const buffer = User.encode(user).finish();
  console.log(buffer);
  const userBase64 = buffer.toString("base64");
  console.log({ userBase64 });
  const userId = user.id;

  users[userId] = buffer;

  res.status(201).send(user);
});

app.get("/user/:id", (req, res) => {
  const userId = req.params.id;
  const buffer = users[userId];

  if (!buffer) return res.status(404).send("User not found");

  const user = User.decode(buffer);
  res.send(user);
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
