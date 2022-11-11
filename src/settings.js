import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId = localStorage.getItem("appId");
const token = localStorage.getItem("agoraToken");
export const channelName = localStorage.getItem("channelName");

export const config = { mode: "rtc", codec: "vp8", appId: appId, token: token };
export const useClient = createClient(config);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

export const channelParameters = {
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a local video track.
  localVideoTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold a remote video track.
  remoteVideoTrack: null,
  // A variable to hold the remote user id.s
  remoteUid: null,
};

export const remotePlayerContainer = document.getElementById(
  "remotePlayerContainer"
);

export const localPlayerContainer = document.getElementById(
  "localPlayerContainer"
);
