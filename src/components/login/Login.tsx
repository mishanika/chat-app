import React from "react";
import Box from "@mui/material/Box";
import { Typography, useTheme, Input, Button } from "@mui/material";
import space from "../../assets/space.jpg";

const Login = () => {
  const theme = useTheme();

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
            <Input
              placeholder="Username"
              sx={{
                height: "50%",
                backgroundColor: theme.palette.secondaryCustomColor.loginInput,
                "& .MuiInputBase-input": { padding: "0 15px", fontSize: "24px", color: theme.palette.customColor.text },
                "&::after": { content: "none" },
              }}
            />
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
              }}
            >
              Enter
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
