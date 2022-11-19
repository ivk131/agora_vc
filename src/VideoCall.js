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

// Connect with firebase
import { db } from "./utils/firebase";
import { onValue, ref, update } from "firebase/database";

export default function VideoCall(props) {
  const { fullName, isLogin } = props;
  const { setInCall } = props;
  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const [userName, setUserName] = useState("");
  const [auidiences, setAuidiences] = useState([]);
  const [userLogin, setUserLogin] = useState(false);
  const [muteAllAudiences, setMuteAllAudiences] = useState(false);

  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const Push = async users => {
    const res = await fetch(
      "https://agora-vc-default-rtdb.firebaseio.com/audiences.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          State: 1,
          Uid: localStorage.getItem("Uid"),
          image: "https://iplfarmersamvad.com/files/1665566846049null.jpg",
          userID: localStorage.getItem("response_userId"),
          userName: localStorage.getItem("name"),
          requestCode: 1,
          channelName_Uid: `${localStorage.getItem(
            "channelName"
          )}${localStorage.getItem("Uid")}`,
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
    Push();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("isLogin")) {
      setUserLogin(true);
    }

    let init = async (name, userName) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        localStorage.setItem("Uid", user?.uid);
        if (mediaType === "video") {
          setUsers(prevUsers => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
          // setUsers(prevUsers => {
          //   return [...prevUsers, user];
          // });
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
        console.log("error", error);
      }

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

  useEffect(() => {
    const dbRef = ref(db, "audiences");
    setMuteAllAudiences(localStorage.getItem("muteAllAudiences"));
    onValue(dbRef, snapshort => {
      let records = [];
      console.log("snapshort", snapshort);
      snapshort.forEach(childSnapshort => {
        let keyName = childSnapshort.key;
        let value = childSnapshort.val();
        records.push({ key: keyName, value: value });
        setAuidiences(records);
      });
    });
    console.log("auidiences+++", auidiences);
  }, [
    users.length,
    muteAllAudiences,
    localStorage.getItem("muteAllAudiences"),
  ]);

  return (
    <>
      {/* {userLogin && <Navigate to="/group-video-calling-app/signup" /> } */}
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
          <Grid item xs={12} style={{ height: "87vh" }}>
            {start && tracks && (
              <Video
                tracks={tracks}
                users={users}
                fullName={fullName}
                userName={userName}
                auidiences={auidiences}
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
                auidiences={auidiences}
              />
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
