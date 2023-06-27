import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "../chat/Chat";
import Login from "../login/Login";

const Router = () => {
  const auth = localStorage.getItem("auth");
  return (
    <Routes>
      <Route path={"/"} element={auth ? <Chat /> : <Login />}></Route>
    </Routes>
  );
};
export default Router;
