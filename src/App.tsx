import React, { useState } from "react";
import "./App.css";
import Router from "./components/router/Router";
import { MyContext } from "./components/context/Context";
import { IMessage } from "./components/chat/interface";

function App() {
  //const [auth, setAuth] = useState(true);
  const [socket, setSocket] = useState<null | WebSocket>(null);

  return (
    <div className="App">
      <MyContext.Provider value={{ socket: socket, setSocket: setSocket }}>
        <Router />
      </MyContext.Provider>
    </div>
  );
}

export default App;
