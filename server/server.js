const express = require("express");
const uuidFunc = require("uuid");
const cors = require("cors");
const database = require("./firebase-admin/firebase");
const WebSocket = require("ws");
const { FieldValue, FieldPath } = require("firebase-admin/firestore");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
const socket = new WebSocket.Server({ port: process.env.PORT_WEBSOCKET });
const rooms = {
  0: { roomId: 0, users: [], messages: [{ msgType: "", text: "", timestamp: "", userId: 0 }] },
};

socket.on("connection", (userSocket) => {
  let room;
  let id;
  userSocket.on("message", async (message) => {
    const { username, uuid, text, type, photoURL, roomId, timestamp } = JSON.parse(message);
    const messagesRef = database.collection("chatrooms").doc(roomId).collection("messages");
    // const usersRef = database.collection("chatrooms").doc(roomId).collection("users");
    // const usersSnapshot = await usersRef.where("uuid", "==", uuid).get();

    console.log("OwnProperty", rooms.hasOwnProperty(rooms[roomId]));
    if (!rooms.hasOwnProperty(roomId)) {
      rooms[roomId] = {
        roomId: roomId,
        users: [],
        messages: [],
      };
    }

    room = rooms[roomId];
    id = uuid;
    console.log("UserId", id);
    console.log("Room", room);

    switch (type) {
      case "greeting":
        //if (!usersSnapshot.docs.length) {
        room.users.forEach((user) =>
          user.userSocket.send(
            JSON.stringify({
              username: username,
              text: "New member has appeared",
              type: "greeting",
              photoURL: null,
              timestamp: timestamp,
              userId: uuid,
            })
          )
        );
        room.messages.push({ msgType: "greeting", text: "", timestamp: "", userId: uuid });

        //usersRef.doc(uuid).set({ uuid: uuid });

        messagesRef.doc().set({
          username: username,
          text: "New member has appeared",
          type: "greeting",
          photoURL: null,
          timestamp: timestamp,
          userId: uuid,
        });
        //}
        room.users.push({ userSocket: userSocket, uuid: uuid });
        console.log("Connected after greeting", room.users.length);

        break;
      case "message":
        console.log("Connected in message", room.users.length);
        console.log("Room in message", room);

        room.users.forEach((user) => {
          //const sendType = user.uuid !== uuid ? "message" : "myMessage";
          room.messages.push({ msgType: "greeting", text: "", timestamp: timestamp, userId: uuid });

          user.userSocket.send(
            JSON.stringify({
              username: username,
              text: text,
              type: "message",
              photoURL: photoURL,
              timestamp: timestamp,
              userId: uuid,
            })
          );
        });
        messagesRef.doc().set({
          username: username,
          text: text,
          type: "message",
          photoURL: photoURL,
          timestamp: timestamp,
          userId: uuid,
        });
        break;
      default:
        break;
    }

    console.log("Connected ", room.users.length);
    console.log("Received message:", { username, text, type, uuid, photoURL, roomId });
  });

  userSocket.on("close", (userArg) => {
    console.log("________");

    console.log("RoomId", rooms["0"].chatId);
    try {
      const deleteId = room.users.findIndex((user) => user.uuid === id);
      console.log("deleteId", deleteId);
      if (deleteId === -1) {
        return;
      }
      room.users.splice(deleteId, 1);
      userSocket.close();
    } catch (error) {
      console.log("Error", error);
    }
  });
});

app.post("/openChat", async function (request, response) {
  const roomsCollection = database.collection("chatrooms");
  let q = roomsCollection.where("users", "==", request.body.users.sort());

  const querySnapshot = await q.get();

  if (!querySnapshot.size) {
    const id = uuidFunc.v4();
    const sortedUsers = request.body.users.sort();
    //const chatNames = await Promise.all(sortedUsers.map(async (user) => database.collection("users").doc(user).get()));
    //console.log("ChatNames", chatNames);

    await roomsCollection.doc(id).set({
      roomId: id,
      //chatNames: chatNames,
      users: sortedUsers,
    });

    rooms[id] = {
      chatId: id,
      users: [],
      messages: [{ msgType: "", text: "", timestamp: "", userId: 0 }],
    };

    console.log("Update start", request.body.users);
    request.body.users.forEach(async (item) => {
      try {
        console.log("Item", item);
        await database
          .collection("users")
          .doc(item)
          .update({ rooms: FieldValue.arrayUnion(id) });
      } catch (error) {
        console.log(error);
      }
    });
    console.log("Update end");

    response.json(id);
    console.log("Has been created", id);
  } else {
    const data = querySnapshot.docs.map((item) => item.data());
    console.log("Exist", data[0]);

    rooms[data[0]] = {
      chatId: data[0],
      users: [],
      messages: [{ msgType: "", text: "", timestamp: "", userId: 0 }],
    };
    response.json(data[0].roomId);
  }
});

app.post("/fetchMessages", async function (request, response) {
  const messagesRef = database.collection("chatrooms").doc(request.body.roomId).collection("messages");
  console.log(request.body.roomId);
  let messagesQuery = await messagesRef.orderBy("timestamp", "desc").limit(request.body.limit);

  if (request.body.lastMessageTimestamp) {
    messagesQuery = messagesQuery.endBefore(request.body.lastMessageTimestamp);
  }

  const snapshot = await messagesQuery.get();
  const messages = snapshot.docs.map((doc) => doc.data());
  response.json(messages.reverse());
});

app.post("/fetchChats", async function (request, response) {
  const userRef = database.collection("users").doc(request.body.id);
  const chatroomsRef = database.collection("chatrooms");
  let userChatsSnapshot = await userRef.get();

  //console.log(request.body.id);
  //console.log(userChatsSnapshot.data());

  const userChats = userChatsSnapshot.data().rooms;
  const querySnapshot = await chatroomsRef.where(FieldPath.documentId(), "in", userChats).get();
  const chats = querySnapshot.docs.map((data) => data.data());
  //console.log("Chats", chats);
  response.json(chats);
});

app.listen(process.env.PORT_SERVER, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${process.env.PORT_SERVER}`);
});
