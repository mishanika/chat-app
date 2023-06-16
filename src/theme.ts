import { PaletteOptions, Theme, ThemeOptions, createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    customColor: {
      main: string;
      text: string;
    };
    secondaryCustomColor: {
      main: string;
      loginBtn: string;
      loginBg: string;
      loginInput: string;
    };
  }
  interface PaletteOptions {
    customColor?: {
      main: string;
      text: string;
    };
    secondaryCustomColor: {
      main: string;
      loginBtn: string;
      loginBg: string;
      loginInput: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    customColor: {
      main: "#252630",
      text: "#fbfbff",
    },
    secondaryCustomColor: {
      main: "#1985ff",
      loginBtn: "#f14619",
      loginBg: "#15161e",
      loginInput: "#373743",
    },
  },
});
