import React, { useRef, useState, useContext } from "react";
import { Typography, Box, useTheme, Button, styled } from "@mui/material";
import space from "../../assets/space.jpg";
import { MyContext, IContext } from "../context/Context";
import { auth } from "../../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addUser } from "../../firebase/database";

const Input = styled("input")({
  height: "50%",
  backgroundColor: "#373743",
  padding: "0 15px",
  fontSize: "24px",
  color: "#fbfbff",
  borderRadius: "16px",
  outline: "none",
  border: "none",
});

const Login = () => {
  const theme = useTheme();
  const { socket, setSocket } = useContext(MyContext) as IContext;

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    login_hint: "user@example.com",
  });

  const logIn = () => {
    console.log(auth);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;
        addUser(user.displayName as string, user.email as string, user.photoURL as string);

        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${space})`,
        backgroundSize: "cover",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(21,22,30,0.7) 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            margin: "0 25% 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              sx={{
                fontSize: "40px",
                color: theme.palette.customColor.text,
              }}
            >
              Welcome
            </Typography>

            <Typography
              sx={{
                fontSize: "16px",
                color: theme.palette.customColor.text,
                opacity: 0.5,
              }}
            >
              Set a username to get started
            </Typography>
          </Box>

          <Box
            sx={{
              width: 530,
              height: 150,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              "& div, button": { borderRadius: "16px", border: "none" },
            }}
          >
            {/* <Input placeholder="Username" ref={inputRef} /> */}
            <Button
              sx={{
                height: "50%",
                backgroundColor: theme.palette.secondaryCustomColor.loginBtn,
                color: theme.palette.customColor.text,
                transition: "0.2s all ease",
                "&:hover": {
                  backgroundColor: "#f14619",
                  boxShadow: "inset 0px 0px 10px 1px rgba(0,0,0,0.6);",
                },
                "&": {
                  fontSize: "18px",
                  fontWeight: "600",
                },
              }}
              onClick={() => logIn()}
            >
              Sign in with Google
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
