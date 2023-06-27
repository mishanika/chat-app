const express = require("express");
const uuid = require("uuid");
//const admin = require("./firebase/firebase");
const WebSocket = require("ws");
require("dotenv").config();
//const database = admin.database();
const app = express();
const socket = new WebSocket.Server({ port: process.env.PORT });
const users = [];

socket.on("connection", (userSocket) => {
  const id = uuid.v4();

  userSocket.send(JSON.stringify({ uuid: id, type: "uuid" }));

  userSocket.on("message", (message) => {
    const { username, uuid, text, type } = JSON.parse(message);
    console.log(id);
    switch (type) {
      case "greeting":
        users.forEach((user) =>
          user.userSocket.send(
            JSON.stringify({ username: username, text: "New member has appeared", type: "greeting" })
          )
        );
        users.push({ userSocket: userSocket, uuid: id });
        break;
      case "message":
        users.forEach((user) => {
          const sendType = user.uuid !== uuid ? "message" : "myMessage";
          user.userSocket.send(JSON.stringify({ username: username, text: text, type: sendType }));
        });
        break;
      default:
        break;
    }
    console.log("Connected ", users.length);
    console.log("Received message:", { username, text, type, uuid });
  });
  userSocket.on("close", (userArg) => {
    console.log("________");
    const deleteId = users.findIndex((user) => user.uuid === id);
    users.splice(deleteId, 1);
    console.log("Connected ", users.length);
    console.log(users);
  });
});

// socket.on("message", ({ username, text }) => {
//   users.forEach((user) => user.send(JSON.stringify({ username: username, text: text, type: "message" })));
//   console.log("Received message:", { username, text });
// });

socket.on("close", (userArg) => {
  console.log("________");
  users.findIndex(userArg);
});
