const express = require("express");
const uuidFunc = require("uuid");
const cors = require("cors");
const database = require("./firebase-admin/firebase");
const WebSocket = require("ws");
const { FieldValue } = require("firebase-admin/firestore");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
const socket = new WebSocket.Server({ port: process.env.PORT_WEBSOCKET });
const rooms = {
  0: { chatId: 0, users: [], messages: [{ msgType: "", text: "", timestamp: "", userId: 0 }] },
};

socket.on("connection", (userSocket) => {
  let room;
  let id;

  userSocket.on("message", async (message) => {
    const { username, uuid, text, type, photoURL, roomId } = JSON.parse(message);
    room = rooms[roomId];
    id = uuid;
    console.log(uuid);

    switch (type) {
      case "greeting":
        const roomsCollection = database.collection("chatrooms");

        const q = roomsCollection.where("roomId", "==", roomId);

        const querySnapshot = await q.get();

        room.users.forEach((user) =>
          user.userSocket.send(
            JSON.stringify({ username: username, text: "New member has appeared", type: "greeting" })
          )
        );
        room.messages.push({ msgType: "greeting", text: "", timestamp: "", userId: uuid });
        room.users.push({ userSocket: userSocket, uuid: uuid });

        break;
      case "message":
        room.users.forEach((user) => {
          const sendType = user.uuid !== uuid ? "message" : "myMessage";
          room.messages.push({ msgType: "greeting", text: "", timestamp: "", userId: uuid });

          user.userSocket.send(JSON.stringify({ username: username, text: text, type: sendType, photoURL: photoURL }));
        });
        break;
      default:
        break;
    }
    console.log("Connected ", room.users.length);
    console.log("Connected ", room.users);
    console.log("Received message:", { username, text, type, uuid, photoURL });
  });

  userSocket.on("close", (userArg) => {
    console.log("________");
    //Object.keys(rooms).forEach((room) => leave(room));
    const deleteId = room.users.findIndex((user) => user.uuid === id);
    console.log(deleteId);
    room.users.splice(deleteId, 1);
    console.log("Connected ", room.users);
    // console.log(users);
  });
});

app.post("/openChat", async function (request, response) {
  const roomsCollection = database.collection("chatrooms");
  const q = roomsCollection.where("users", "==", request.body.users);
  const querySnapshot = await q.get();

  if (querySnapshot.empty) {
    const id = uuidFunc.v4();

    await roomsCollection.doc(id).set({
      roomId: id,
      messages: [],
      users: [...request.body.users],
    });

    request.body.users.forEach((item) => async () => {
      try {
        await database
          .collection("users")
          .where("id", "==", item)
          .update({ rooms: FieldValue.arrayUnion(id) });
      } catch (error) {
        console.log(error);
      }
    });

    response.json(id);
    console.log("Has been created", id);
  } else {
    const data = querySnapshot.docs.map((item) => item.data());
    console.log("Exist", data[0]);

    response.json(data[0].roomId);
  }
});

app.listen(process.env.PORT_SERVER, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${process.env.PORT_SERVER}`);
});
