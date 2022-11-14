import { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import VideoCall from "./VideoCall";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Container, Box, Typography } from "@material-ui/core";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import WelcomeScreen from "./components/WelcomeScreen";
import axios from "axios";
import { db } from "../src/utils/firebase";
import { onValue, ref } from "firebase/database";
import Header from "./components/header/Header";

function App() {
  const [inCall, setInCall] = useState(true);
  const [fullName, setFullName] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [userLogin, setUserLogin] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLogin")) {
      setUserLogin(true);
    } else {
      setUserLogin(false);
    }

    const query = ref(db, "events");
    return onValue(query, snapshort => {
      const data = snapshort.val();

      if (snapshort.exists()) {
        Object.values(data).map(event => {
          setEventsList(event => [...eventsList, event]);
        });
      }
    });
  }, []);

  return (
    <BrowserRouter>
      {/* {userLogin && <Navigate to="/login" replace={true} />} */}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<WelcomeScreen />} />
        `${userLogin}` ?{" "}
        <Route
          path="/"
          element={<VideoCall setInCall={setInCall} fullName={fullName} />}
        />{" "}
        : <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// /group-video-calling-app
