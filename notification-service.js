const express = require("express");
const protobuf = require("protobufjs");
const app = express();
const PORT = 3003;

const Notification = protobuf
  .loadSync("notification.proto")
  .lookupType("Notification");

app.use(express.json());

app.post("/notify", (req, res) => {
  const payload = req.body;

  const errMsg = Notification.verify(payload);
  if (errMsg) return res.status(400).send(errMsg);

  const notification = Notification.create(payload);
  const buffer = Notification.encode(notification).finish();

  console.log(
    `Notification: ${notification.message} to user ${notification.user.name} at ${notification.user.email}`
  );

  res.send(buffer);
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
