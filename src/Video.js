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

export default function Video(props) {
  const { users, tracks, fullName, userName, auidiences } = props;
  const [gridSpacing, setGridSpacing] = useState(12);
  const [auidienceName, setauidienceName] = useState("");
  const [trackState, setTrackState] = useState({ video: true, audio: true });

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

  const getUserName = () => {};

  useEffect(() => {
    // setGridSpacing(Math.max(Math.floor(12 / (users.length + 1)), 4));
    setGridSpacing(Math.max(Math.floor(12 / (users.length + 1))));
    console.log("gridSpacing", gridSpacing);

    console.log("resresresresresres", filterByReference(users, auidiences));
  }, [users, tracks]);

  const totalUsers = users?.length + 1;

  console.log("users.................", users);

  const remoteMute = async type => {
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
  };

  return (
    <Grid
      container
      style={{
        height: "100%",
        paddingLeft: "24px",
        paddingRight: "24px",
        background: "#454545",
        width: "100%",
      }}
      spacing={1}
    >
      <Grid
        item
        className="admin__video__container"
        style={{ height: "380px", width: "80%" }}
        sm={12}
        xs={12}
        // lg={gridSpacing}
      >
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          id="localPlayerContainer"
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "0 10%",
            height: "100%",
            width: "100%",
            maxHeight: `${totalUsers} <= 2 ? 100%: 280px`,
            position: "relative",
          }}
        >
          <Box
            style={{
              position: "absolute",
              bottom: "1%",
              left: "10.2%",
              zIndex: 1,
              background: "#F2F4F6",
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
                  height: "145px",
                  display: "flex",
                  overflow: "auto",
                }}
                xs={2}
              >
                <AgoraVideoPlayer
                  videoTrack={user.videoTrack}
                  key={user.uid}
                  style={{
                    position: "relative",
                    height: "100%",
                    width: "100%",
                    maxHeight: `${totalUsers} <= 2 ? 100%: 280px`,
                  }}
                >
                  <Box
                    style={{
                      position: "absolute",
                      bottom: "1%",
                      left: "1%",
                      zIndex: 1,
                      background: "#fafafa",
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
                    <IconButton onClick={() => remoteMute("audio")}>
                      <MicIcon fontSize="small" />
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
