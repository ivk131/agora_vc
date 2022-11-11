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

  useEffect(() => {
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
      {/* <Header /> */}
      <Routes>
        <Route path="/group-video-calling-app/signup" element={<SignUp />} />
        <Route path="/group-video-calling-app/login" element={<Login />} />
        <Route
          path="/group-video-calling-app/welcome"
          element={<WelcomeScreen />}
        />
        <Route
          path="/group-video-calling-app"
          element={<VideoCall setInCall={setInCall} fullName={fullName} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
