import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid, Box, Card, Typography, IconButton } from "@material-ui/core";
import { useState, useEffect } from "react";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import {
  config,
  useClient,
  useMicrophoneAndCameraTracks,
  channelName,
} from "./settings.js";
import { db } from "./utils/firebase";
import { onValue, ref, update } from "firebase/database";

export default function Video(props) {
  const { users, tracks, fullName, userName, auidiences } = props;
  const [gridSpacing, setGridSpacing] = useState(12);
  const [auidienceName, setauidienceName] = useState("");
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [updatedAudience, setUpdatedAuidience] = useState([]);
  const [isAudienceMute, setisAudienceMute] = useState(false);

  const client = useClient();

  const filterByReference = (users, auidiences) => {
    let res = [];
    res = users.filter(el => {
      return !auidiences.find(element => {
        return element.Uid === el.uid;
      });
    });
    return res;
  };

  useEffect(() => {
    // setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
    setGridSpacing(Math.max(Math.floor(12 / (users.length + 1))));
    console.log("gridSpacing", gridSpacing);

    console.log("resresresresresres", filterByReference(users, auidiences));
  }, [users, tracks]);

  const totalUsers = users?.length + 1;

  const remoteMute = async (type, user) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState(ps => {
        return { ...ps, audio: !ps.audio };
      });
      alert("mute remote-1");
      client.on("stream-subscribed", function (evt) {
        var stream = evt.stream;
        alert("mute remote-2");
        // Mutes the remote stream.
        stream.muteAudio();
        console.log("stream-subscribed--------------------------", stream);
      });
      alert("mute remote-3");
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState(ps => {
        return { ...ps, video: !ps.video };
      });
    }
    setisAudienceMute(!isAudienceMute);
  };

  // useEffect(() => {
  //   const dbRef = ref(db, "audiences");

  //   onValue(dbRef, snapshort => {
  //     let records = [];
  //     console.log("snapshort", snapshort);
  //     snapshort.forEach(childSnapshort => {
  //       let keyName = childSnapshort.key;
  //       let value = childSnapshort.val();
  //       records.push({ key: keyName, value: value });
  //       setUpdatedAuidience(records);
  //     });
  //   });
  // }, []);

  console.log("---------------------", updatedAudience);

  return (
    <Grid
      container
      style={{
        height: "100%",
        background: "#454545",
        width: "100%",
      }}
      spacing={1}
    >
      <Grid
        item
        className="admin__video__container"
        style={{ height: "392px", width: "70%" }}
        sm={12}
        xs={12}
      >
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          id="localPlayerContainer"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 15%",
            height: "100%",
            background: "#000",
            width: "100%",
            maxHeight: `${totalUsers} <= 2 ? 100%: 280px`,
            position: "relative",
          }}
        >
          <Box
            style={{
              position: "absolute",
              bottom: "2%",
              left: "15.2%",
              zIndex: 1,
              background: "#f2f4f6",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            <Typography variant="body2"> {userName ?? "Guest"} </Typography>
          </Box>
        </AgoraVideoPlayer>
      </Grid>
      {users.length > 0 &&
        users.map(user => {
          if (user.videoTrack) {
            return (
              <Grid
                item
                className="admin__video__container2"
                style={{
                  height: "142px",
                  display: "flex",
                  justifyContent: "center",
                  overflow: "auto",
                }}
                xs={4}
                sm={2}
              >
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  key={user.uid}
                  style={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    background: "#fff",
                    // maxHeight: `${totalUsers} <= 2 ? 100%: 280px`,
                  }}
                >
                  <Box
                    style={{
                      position: "absolute",
                      bottom: "1%",
                      left: "1%",
                      zIndex: 1,
                      background: "#fff",
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography variant="body2">{user?.uid} </Typography>
                  </Box>
                  <Box
                    style={{
                      position: "absolute",
                      // bottom: "1%",
                      top: "1%",
                      right: "1%",
                      zIndex: 1,
                      padding: "2px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    <IconButton onClick={() => remoteMute("type", user)}>
                      {user.requestCode === 2 || isAudienceMute ? (
                        <MicOffIcon color="secondary" fontSize="small" />
                      ) : (
                        <MicIcon color="primary" fontSize="small" />
                      )}
                    </IconButton>
                  </Box>
                </AgoraVideoPlayer>
              </Grid>
            );
          } else return null;
        })}
    </Grid>
  );
}

// totalUsers === 1
// ? 12
// : null || totalUsers === 2
// ? 6
// : null || totalUsers === 3
// ? 4
// : null || totalUsers === 4
// ? 6
// : null || totalUsers > 4
// ? 3
// : null
