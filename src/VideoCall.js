import { useState, useEffect } from "react";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "./settings.js";
import { Grid, Toolbar, Box } from "@material-ui/core";
import Video from "./Video";
import Controls from "./Controls";
import SignUp from "./components/SignUp.js";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

// Connect with firebase
import { db } from "./utils/firebase";
import { onValue, ref } from "firebase/database";

export default function VideoCall(props) {
  const { fullName, isLogin } = props;
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [userName, setUserName] = useState("");
  const [auidiences, setAuidiences] = useState([]);
  // const [isLogin, setIsLogin] = useState(false);

  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const Push = async user => {
    const res = await fetch(
      "https://agora-vc-default-rtdb.firebaseio.com/audiences.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          State: 1,
          Uid: user.uid,
          image: "https://iplfarmersamvad.com/files/1665566846049null.jpg",
          userID: localStorage.getItem("response_userId"),
          userName: localStorage.getItem("name"),
        }),
      }
    );

    if (res) {
      console.log("Data Stored", res);
    } else {
      alert("Something went worng!!!");
    }
  };

  useEffect(() => {
    let init = async (name, userName) => {
      localStorage.getItem("isLogin") &&
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          if (mediaType === "video") {
            Push(user);
            setUsers(prevUsers => {
              return [...prevUsers, user];
            });
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "audio") {
          if (user.audioTrack) user.audioTrack.stop();
        }
        if (mediaType === "video") {
          setUsers(prevUsers => {
            return prevUsers.filter(User => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", user => {
        setUsers(prevUsers => {
          return prevUsers.filter(User => User.uid !== user.uid);
        });
      });

      try {
        await client.join(config.appId, name, config.token, 0);
      } catch (error) {
        console.log("error");
      }

      console.log("client--------------------------------", client.publish);
      if (tracks)
        await client
          .publish([tracks[0], tracks[1]])
          .then(response => console.log("response", response))
          .catch(error => "Error");
      setStart(true);
    };

    if (ready && tracks) {
      try {
        init(channelName, fullName);
      } catch (error) {
        console.log(error);
      }
    }
    setUserName(localStorage.getItem("name"));
  }, [channelName, client, ready, tracks]);

  console.log("users-----------------------------------------", users);

  useEffect(() => {
    const query = ref(db, "database__name");
    return onValue(query, snapshot => {
      const data = snapshot.val();

      if (snapshot.exists()) {
        Object.values(data).map(auidience => {
          setAuidiences(auidience => [...auidiences, auidience]);
        });
      }
    });
  }, []);

  return (
    <Box
      style={{
        background: "#0000",
        padding: "4px",
      }}
    >
      <Grid
        container
        style={{
          background: "#0000",
        }}
      >
        <Grid item xs={12} style={{ height: "85vh" }}>
          {start && tracks && (
            <Video
              tracks={tracks}
              users={users}
              fullName={fullName}
              userName={userName}
            />
          )}
        </Grid>
        {/* <Toolbar /> */}

        <Grid item xs={12}>
          {ready && tracks && (
            <Controls
              tracks={tracks}
              setStart={setStart}
              setInCall={setInCall}
              users={users}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
