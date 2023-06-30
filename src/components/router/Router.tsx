import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "../chat/Chat";
import Login from "../login/Login";
import { auth } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Router = () => {
  //const auth = localStorage.getItem("auth");
  const [user] = useAuthState(auth);

  return (
    <Routes>
      <Route path={"/"} element={user ? <Chat /> : <Login />}></Route>
    </Routes>
  );
};
export default Router;
