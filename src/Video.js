import { AgoraVideoPlayer } from "agora-rtc-react";
import { Grid, Box, Card, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";

export default function Video(props) {
  const { users, tracks, fullName, userName, auidiences } = props;
  const [gridSpacing, setGridSpacing] = useState(12);
  const [auidienceName, setauidienceName] = useState("");

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

  return (
    <Grid
      container
      style={{
        height: "100%",
        paddingLeft: "24px",
        paddingRight: "24px",
        background: "#454545",
      }}
      spacing={1}
    >
      <Grid
        item
        className="admin__video__container"
        sm={
          totalUsers === 1
            ? 12
            : null || totalUsers === 2
            ? 6
            : null || totalUsers === 3
            ? 4
            : null || totalUsers === 4
            ? 6
            : null || totalUsers > 4
            ? 3
            : null
        }
        xs={
          totalUsers === 1
            ? 12
            : null || totalUsers === 2
            ? 6
            : null || totalUsers === 3
            ? 6
            : null || totalUsers === 4
            ? 6
            : null || totalUsers > 4
            ? 6
            : null
        }
        // lg={gridSpacing}
      >
        <AgoraVideoPlayer
          videoTrack={tracks[1]}
          id="localPlayerContainer"
          style={{
            display: "flex",
            justifyContent: "center",
            height: "100%",
            width: "90%",
            maxHeight: `${totalUsers} <= 2 ? 100%: 280px`,
            position: "relative",
          }}
        >
          <Box
            style={{
              position: "absolute",
              bottom: "1%",
              left: "1%",
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
                sm={
                  totalUsers === 1
                    ? 12
                    : null || totalUsers === 2
                    ? 6
                    : null || totalUsers === 3
                    ? 4
                    : null || totalUsers === 4
                    ? 6
                    : null || totalUsers > 4
                    ? 3
                    : null
                }
                xs={
                  totalUsers === 1
                    ? 12
                    : null || totalUsers === 2
                    ? 6
                    : null || totalUsers === 3
                    ? 6
                    : null || totalUsers === 4
                    ? 6
                    : null || totalUsers > 4
                    ? 6
                    : null
                }
                style={{ minHeight: "230px", borderRadius: "16px" }}
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
                </AgoraVideoPlayer>
              </Grid>
            );
          } else return null;
        })}
    </Grid>
  );
}
