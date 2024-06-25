// Import the compiled Protobuf module
const protobuf = require("protobufjs");
const path = require("path");

// Load the protobuf definition
protobuf.load(path.join(__dirname, "person.proto"), (err, root) => {
  if (err) throw err;

  // Obtain a message type
  const Person = root.lookupType("Person");

  // Create a new message
  const payload = { name: "John Doe", id: 123, email: "johndoe@example.com" };

  // Verify the payload if necessary (i.e. when possibly incomplete or invalid)
  const errMsg = Person.verify(payload);
  if (errMsg) throw Error(errMsg);

  // Create a new message
  const message = Person.create(payload); // or use .fromObject if conversion is necessary

  // Encode a message to an Uint8Array (browser) or Buffer (node)
  const buffer = Person.encode(message).finish();
  console.log("Encoded buffer:", buffer);

  // Decode an Uint8Array (browser) or Buffer (node) to a message
  const decodedMessage = Person.decode(buffer);
  console.log("Decoded message:", decodedMessage);

  // If your application uses plain objects you may convert back and forth between
  // these objects and messages using:
  const object = Person.toObject(message, {
    longs: String,
    enums: String,
    bytes: String,
    // see ConversionOptions
  });
  console.log("Object:", object);
});
