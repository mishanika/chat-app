import React, { useRef, useContext, useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import SendSVG from "../svg/SendSVG";
import { MyContext, IContext } from "../context/Context";
import { TextArea, MyMessage, Message, GreetingMessage, Username, Input, Img } from "./styledElements/StyledElements";
import { IChat, IMessage, IUser } from "./interface";
import { auth } from "../../firebase/firebase";
import space from "../../assets/space.jpg";
import { findUser } from "../../firebase/database";

const Chat = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [chats, setChats] = useState<IChat[]>([]);
  const [roomId, setRoomId] = useState<string>("0");
  const [isPending, setIsPending] = useState<boolean>(false);
  const { socket, setSocket } = useContext(MyContext) as IContext;
  const chatRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPending) {
      setIsPending(true);
    }
  }, []);

  useEffect(() => {
    if (isPending) {
      const promise = new Promise((resolve, reject) => {
        const socket: WebSocket = new WebSocket("ws://localhost:3030");

        resolve(socket);
        reject("sowwy, smth happened :(");
      })
        .then((socket) => {
          setSocket(socket as WebSocket);
          console.log("socket done");
          fetchMessages(roomId);
          setIsPending(false);
        })
        .catch((error) => {
          console.error("Failed to set socket:", error);
          setIsPending(false);
        });
    }

    return () => {
      socket?.close();
    };
  }, [isPending]);

  useEffect(() => {
    if (socket) {
      console.log("We are in socket events useEffect");
      console.log(socket.readyState);
      const message = {
        username: localStorage.getItem("username"),
        uuid: localStorage.getItem("uuid"),
        text: textRef.current!.value,
        type: "greeting",
        photoURL: localStorage.getItem("photoURL"),
        roomId: roomId,
        timestamp: Date.now(),
      };

      if (socket.readyState === 1) {
        socket.send(
          JSON.stringify({
            ...message,
          })
        );
        console.log("MESSAGE HAS BEEN SENT");
      }
      socket.onopen = () => {
        socket.send(
          JSON.stringify({
            ...message,
          })
        );
        console.log("MESSAGE HAS BEEN SENT");
      };

      socket!.onmessage = (message) => {
        const messageData = JSON.parse(message.data);
        setMessages((prev) => [...prev, messageData]);
      };

      socket!.onclose = (e) => {
        console.log("Code", e.code);
        console.log("Was clean", e.wasClean);
      };
    }
  }, [socket]);

  useEffect(() => {
    const dataToPost = {
      id: localStorage.getItem("uuid"),
    };
    fetch("http://localhost:3333/fetchChats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(dataToPost),
    })
      .then((data) => data.json())
      .then((data) => setChats(data));
  }, []);

  const sendMessage = (roomId: string) => {
    const message = {
      username: localStorage.getItem("username"),
      uuid: localStorage.getItem("uuid"),
      text: textRef.current!.value,
      type: "message",
      photoURL: localStorage.getItem("photoURL"),
      roomId: roomId,
      timestamp: Date.now(),
    };
    socket!.send(JSON.stringify(message));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      sendMessage(roomId);
    }
  };

  const renderMessage = ({ username, text, type, photoURL, userId }: IMessage) => {
    const id = localStorage.getItem("uuid");
    if (type === "greeting") {
      return <GreetingMessage>{text}</GreetingMessage>;
    } else if (userId === id) {
      return (
        <Box sx={{ display: "flex", gap: "5px", alignSelf: "flex-end", margin: "0 10px 0 0" }}>
          <MyMessage>{text}</MyMessage>
        </Box>
      );
    } else {
      return (
        <Box sx={{ display: "flex", gap: "5px", alignSelf: "flex-start" }}>
          <Img src={photoURL} sx={{ alignSelf: "center" }} />
          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px", alignSelf: "flex-start" }}>
            <Username>{username}</Username>
            <Message>{text}</Message>
          </Box>
        </Box>
      );
    }
  };

  const searchUser = async () => {
    const users = (await findUser(searchRef.current!.value).then((data) => data)) as unknown as IUser[];
    console.log(users);
    setUsers(users);
  };

  const reconnecting = () => {
    socket!.close();
    setIsPending(true);
  };

  const openNewChat = async (id: string) => {
    const dataToPost = {
      users: [id, localStorage.getItem("uuid")],
    };
    const response = await fetch("http://localhost:3333/openChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(dataToPost),
    });
    const data = await response.json();
    setRoomId(data);
    reconnecting();
    fetchMessages(data);
  };
  const openExistingChat = (chatId: string) => {
    setRoomId(chatId);
    reconnecting();
    fetchMessages(chatId);
  };

  const fetchMessages = async (roomId: string) => {
    const dataToPost = {
      roomId: roomId,
      limit: 40,
      lastMessageTimestamp: messages.length ? messages[0].timestamp : null,
    };
    const response = await fetch("http://localhost:3333/fetchMessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(dataToPost),
    });
    const data = await response.json();
    setMessages(data);
  };

  const renderUsers = ({ username, photoURL, id }: IUser) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "25px",
        padding: "10px",
        margin: "15px",
        borderRadius: "16px",
        background: theme.palette.secondaryCustomColor.secondary,
        cursor: "pointer",
        transition: "0.1s all ease",
        "&:hover": {
          boxShadow: "0px 0px 15px 5px rgba(0,0,0,0.5)",
        },
      }}
      onClick={() => openNewChat(id)}
    >
      <Img src={photoURL}></Img>
      <Typography
        sx={{
          color: theme.palette.customColor.text,
          fontSize: "20px",
        }}
      >
        {username}
      </Typography>
    </Box>
  );

  const renderUserChats = ({ chatName, photoURL, roomId }: IChat) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "25px",
        padding: "10px",
        margin: "15px",
        borderRadius: "16px",
        background: theme.palette.secondaryCustomColor.secondary,
        cursor: "pointer",
        transition: "0.1s all ease",
        "&:hover": {
          boxShadow: "inset 0px 0px 15px 5px rgba(0,0,0,0.5)",
        },
      }}
      onClick={() => openExistingChat(roomId)}
    >
      {photoURL ? (
        <Img src={photoURL}></Img>
      ) : (
        <Box
          sx={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#fff",
          }}
        ></Box>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
        <Typography
          sx={{
            color: theme.palette.customColor.text,
            fontSize: "20px",
          }}
        >
          {chatName}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "#252630",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: theme.palette.customColor.text,
        padding: "25px 5%",
        boxSizing: "border-box",
      }}
      onKeyDown={(e) => handleKeyDown(e)}
    >
      <Box
        sx={{
          flexGrow: "1",
          maxWidth: "400px",
          height: "100% ",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderBottom: "1px solid" + theme.palette.secondaryCustomColor.secondary,
          borderTop: "1px solid" + theme.palette.secondaryCustomColor.secondary,
          borderLeft: "1px solid" + theme.palette.secondaryCustomColor.secondary,
        }}
      >
        <Box>
          <Input ref={searchRef} placeholder="Enter username" onChange={() => searchUser()} />
          <Box>
            {searchRef.current && Number(searchRef.current!.value.length) <= 0
              ? chats.map(renderUserChats)
              : users.map(renderUsers)}
          </Box>
        </Box>
        <Box
          sx={{
            width: "fit-content",
            fontSize: "22px",
            padding: "10px 10px",
            boxSizing: "border-box",
            cursor: "pointer",
          }}
          onClick={() => auth.signOut()}
        >
          Logout
        </Box>
      </Box>
      <Box
        sx={{
          //width: "calc(75% + 25px + 45px)",
          //maxWidth: "1300px",
          flexGrow: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderBottomRightRadius: "16px",
          borderTopRightRadius: "16px",
          background: "linear-gradient(0deg, rgba(55,55,67,1) 0%, rgba(37,38,48,1) 100%)",
          padding: "0 50px",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "60px",
            padding: "15px 30px",
            margin: "0 0 15px 0",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            border: "1px solid white",
          }}
        >
          <Img src={space} />
          <Img src={space} />
        </Box>
        <Box
          sx={{
            height: "calc(100% - 60px - 100px)",
            fontSize: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            overflowY: "auto",
            scrollbarGutter: "stable both-edges",
            "&::-webkit-scrollbar": {
              width: "10px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",

              fontSize: "20px",
              "&> div:first-child": {
                marginTop: "auto",
              },
            }}
            ref={chatRef}
          >
            {messages.map(renderMessage)}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "100px",
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
            <SendSVG cursor="pointer" color="#fff" onClick={() => sendMessage(roomId)} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
export default Chat;
