const express = require("express");
const protobuf = require("protobufjs");
const app = express();
const PORT = 3002;

const User = protobuf.loadSync("user.proto").lookupType("User");

app.use(express.json());

app.post("/send-email", (req, res) => {
  const userBase64 = req.body.user;

  // Decode base64 to buffer
  const userBuffer = Buffer.from(userBase64, "base64");

  const user = User.decode(userBuffer);

  console.log(`Sending email to ${user.name} at ${user.email}`);

  res.send(`Email sent to ${user.email}`);
});

app.listen(PORT, () => {
  console.log(`Email Service running on port ${PORT}`);
});
