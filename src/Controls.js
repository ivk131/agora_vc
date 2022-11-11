import { useEffect, useState } from "react";
import { useClient } from "./settings";
import {
  Grid,
  Button,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Badge,
  makeStyles,
  Typography,
} from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import GroupsIcon from "@material-ui/icons/GroupSharp";
import CallEndIcon from "@material-ui/icons/CallEnd";
import DialogModal from "./components/DialogModal";
import { Link, Navigate } from "react-router-dom";
import ScreenShareIcon from "@material-ui/icons/ScreenShare";
import StopScreenShareIcon from "@material-ui/icons/StopScreenShare";
import PanToolIcon from "@material-ui/icons/PanTool";
import // createScreenVideoTrack,
// ScreenVideoTrackInitConfig,
// ILocalVideoTrack,
// ILocalAudioTrack,
"agora-rtc-react";

import AgoraRTC, {
  BufferSourceAudioTrackInitConfig,
  CameraVideoTrackInitConfig,
  ClientConfig,
  CustomAudioTrackInitConfig,
  CustomVideoTrackInitConfig,
  IAgoraRTCClient,
  IBufferSourceAudioTrack,
  ICameraVideoTrack,
  ILocalAudioTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
  IRemoteVideoTrack,
  MicrophoneAudioTrackInitConfig,
  ScreenVideoTrackInitConfig,
} from "agora-rtc-sdk-ng";

const styles = makeStyles(theme => ({
  iconsContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
}));

export default function Controls(props) {
  const client = useClient();
  const { tracks, setStart, setInCall, users } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const [open, setOpen] = useState(false);
  const [isSharingEnabled, setisSharingEnabled] = useState(false);
  const [isMuteAll, setisMuteAll] = useState(false);
  const classes = styles();

  const handleClose = () => setOpen(true);

  const channelParameters = {
    localAudioTrack: null,
    localVideoTrack: null,
    remoteAudioTrack: null,
    remoteVideoTrack: null,
    remoteUid: null,
    screenTrack: null,
  };

  const mute = async type => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState(ps => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState(ps => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    // client.remoteUsers();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  const handleScreenShare = async () => {
    const remotePlayerContainer = document.getElementById(
      "remotePlayerContainer"
    );

    const localPlayerContainer = document.getElementById(
      "localPlayerContainer"
    );

    const localPlayerContainer__screen = document.getElementById(
      "localPlayerContainer__screen"
    );

    if (isSharingEnabled == false) {
      channelParameters.screenTrack = await AgoraRTC.createScreenVideoTrack();

      console.log("channelParameters", channelParameters.screenTrack);

      setisSharingEnabled(true);
      // channelParameters.localVideoTrack.stop();

      await client.unpublish(channelParameters.localVideoTrack);
      // Publish the screen track.

      await client.publish(channelParameters.screenTrack);
      // Play the screen track on local container.

      console.log(
        " channelParameters.screenTrack============ 7",
        channelParameters
      );
      // channelParameters.localVideoTrack.play(localPlayerContainer__screen);

      // channelParameters.screenTrack.play(localPlayerContainer);

      setisSharingEnabled(true);
      console.log("isSharingEnabled", isSharingEnabled);
    } else {
      console.log("screen track line 140", channelParameters.screenTrack);
      channelParameters.screenTrack.stop();
      await client.unpublish(channelParameters.screenTrack);
      await client.publish(channelParameters.localVideoTrack);
      channelParameters.localVideoTrack.play(localPlayerContainer__screen);
      isSharingEnabled = false;
    }
  };

  const handleRaiseHand = () => {
    alert("Raise Hand ?");
  };

  return (
    <Box
      style={{
        background: "#454545",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
      }}
      justifyContent="center"
      p={2}
    >
      <Grid container alignItems="center" display="flex" justify="center">
        <Grid item xs={4} sm={1} textAlign="center">
          <Box textAlign="center">
            <Tooltip
              arrow
              title={
                trackState.audio ? "Turn off microphone" : "Turn on microphone"
              }
            >
              <IconButton
                variant="contained"
                color={trackState.audio ? "primary" : ""}
                onClick={() => mute("audio")}
              >
                {trackState.audio ? <MicIcon /> : <MicOffIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        <Grid item xs={4} sm={1} textAlign="center">
          <Box textAlign="center">
            <Tooltip
              arrow
              title={trackState.video ? "Turn off camera" : "Turn on camera"}
            >
              <IconButton
                variant="contained"
                color={trackState.video ? "primary" : ""}
                onClick={() => mute("video")}
              >
                {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        <Grid item xs={4} sm={1} textAlign="center">
          <Box textAlign="center">
            <Tooltip arrow title={!isSharingEnabled ? "Present Now" : "Stop"}>
              <IconButton
                variant="contained"
                color={isSharingEnabled ? "primary" : ""}
                onClick={handleScreenShare}
              >
                {!isSharingEnabled ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        <Grid item xs={4} sm={1}>
          <Box textAlign="center">
            <Tooltip title="Raise Hand" arrow>
              <IconButton
                variant="contained"
                color={isSharingEnabled ? "primary" : ""}
                onClick={handleRaiseHand}
              >
                <PanToolIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        <Grid item xs={4} sm={1}>
          <Box textAlign="center">
            <Tooltip title=" Hang call" arrow>
              <IconButton
                variant="outlined"
                color="secondary"
                style={{ color: "red" }}
                onClick={() => {
                  leaveChannel();
                  window.location.href = "/group-video-calling-app/welcome";
                }}
              >
                <CallEndIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        {/* <Box pl={3} /> */}
        <Grid item xs={4} sm={1}>
          <Box textAlign="center">
            <IconButton>
              <Badge badgeContent={users?.length + 1}>
                <GroupsIcon />
              </Badge>
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      {/* <Divider orientation="vertical" variant="middle" flexItem /> */}

      {/* 
      <DialogModal
        onClose={handleClose}
        open={open}
        setOpen={setOpen}
        users={users}
      /> */}
    </Box>
  );
}
