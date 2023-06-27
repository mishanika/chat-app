import { styled } from "@mui/material";

export const TextArea = styled("textarea")({
  resize: "none",
  width: "75%",
  background: "transparent",
  ":focus-visible": {
    outline: "#1985ff 1px;",
    boxShadow: "0px 0px 5px 1px rgba(25,133,255,1)",
  },
  color: "#fbfbff",
  boxSizing: "border-box",
  padding: "6px 10px",
  fontSize: "18px",
  overflow: "hidden",
  borderRadius: "16px",
});

export const MyMessage = styled("div")({
  width: "200px",
  background: "#1985ff",
  padding: "5px 10px",
  borderRadius: "16px",
  alignSelf: "flex-end",
});

export const Message = styled("div")({
  width: "200px",
  background: "#3b3d4b",
  padding: "5px 10px",
  borderRadius: "16px",
});

export const GreetingMessage = styled("div")({
  width: "200px",
  background: "transparent",
});

export const Username = styled("span")({
  fontSize: "16px",
});
