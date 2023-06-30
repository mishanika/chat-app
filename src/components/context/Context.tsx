import { createContext } from "react";
import { IMessage } from "../chat/interface";

export const MyContext = createContext<IContext | null>(null);

export interface IContext {
  // auth: boolean;
  // setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  socket: WebSocket | null;
  setSocket: React.Dispatch<React.SetStateAction<null | WebSocket>>;
}
