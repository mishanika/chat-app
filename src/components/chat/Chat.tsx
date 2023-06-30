import React, { useRef, useContext, useEffect, useState } from "react";
import { Typography, Box, useTheme } from "@mui/material";
import SendSVG from "../svg/SendSVG";
import { MyContext, IContext } from "../context/Context";
import { TextArea, MyMessage, Message, GreetingMessage, Username } from "./styledElements/StyledElements";
import { IMessage } from "./interface";
import { auth } from "../../firebase/firebase";

const Chat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { socket, setSocket } = useContext(MyContext) as IContext;
  const chatRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  let isPending = false;
  useEffect(() => {
    if (isPending) {
      // A fetch is already in progress, so return the existing promise
      return;
    }

    isPending = true;

    if (isPending) {
      const promise = new Promise((resolve, reject) => {
        const socket: WebSocket = new WebSocket("ws://localhost:3030");

        resolve(socket);
      })
        .then((socket) => {
          setSocket(socket as WebSocket);
          isPending = false; // Reset the fetch status
        })
        .catch((error) => {
          console.error("Failed to set socket:", error);
          isPending = false; // Reset the fetch status
        });
      console.log("socket done");
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket!.onopen = (message) => {
        socket!.send(
          JSON.stringify({
            username: localStorage.getItem("username"),
            uuid: localStorage.getItem("uuid"),
            text: textRef.current!.value,
            type: "greeting",
          })
        );
      };

      socket!.onmessage = (message) => {
        const messageData = JSON.parse(message.data);
        if (messageData.type === "uuid") {
          localStorage.setItem("uuid", messageData.uuid);
          return;
        }
        console.log(messageData);
        setMessages((prev) => [...prev, messageData]);
      };

      socket!.onclose = () => {
        localStorage.removeItem("uuid");
        localStorage.removeItem("auth");
      };
    }
  }, [socket]);

  const sendMessage = () => {
    const message = {
      username: localStorage.getItem("username"),
      uuid: localStorage.getItem("uuid"),
      text: textRef.current!.value,
      type: "message",
    };
    socket!.send(JSON.stringify(message));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const renderMessage = ({ username, text, type }: IMessage) => {
    switch (type) {
      case "greeting":
        return <GreetingMessage>{text}</GreetingMessage>;
      case "myMessage":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignSelf: "flex-end" }}>
            <MyMessage>{text}</MyMessage>
          </Box>
        );
      case "message":
        return (
          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignSelf: "flex-start" }}>
            <Username>{username}</Username>
            <Message>{text}</Message>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "#373743",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onKeyDown={(e) => handleKeyDown(e)}
    >
      <Box
        sx={{
          width: "50%",
          height: "50%",
          background: "#252630",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          gap: "25px",
        }}
      >
        <Box
          sx={{
            width: "calc(75% + 25px + 45px)",
            height: "75%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "15px",
            color: theme.palette.customColor.text,
          }}
          ref={chatRef}
        >
          {messages.map(renderMessage)}
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "25px",
          }}
        >
          <TextArea ref={textRef} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.palette.secondaryCustomColor.main,
              padding: "10px",
              borderRadius: "16px",
            }}
          >
            <SendSVG cursor="pointer" color="#fff" onClick={() => sendMessage()} />
          </Box>
        </Box>
      </Box>
      <Box onClick={() => auth.signOut()}>sign out</Box>
    </Box>
  );
};
export default Chat;
