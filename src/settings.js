import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";

const appId =
  "002d67ae068040be96b28ec17b115ea8" || localStorage.getItem("appId");
const token =
  "007eJxTYHh9dNPPCsXkm9ouJ6I2qe13jmJfOflvQVVTf/xBtoTAtHYFBgMDoxQz88RUAzMLAxODpFRLsyQji9RkQ/MkQ0PT1ESLsIay5IZARgZ2rb2MjAwQCOKLM5RlpqTmx8cn5+elFaXmJWfmpcfHJxYUMDAAAPyNJnY" ||
  localStorage.getItem("agoraToken");
export const channelName =
  "video__confrencing__app" || localStorage.getItem("channelName");

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
