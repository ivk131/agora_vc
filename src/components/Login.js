import React, { useState, useEffect } from "react";
import {
  TextField,
  Paper,
  Button,
  Box,
  Typography,
  Container,
} from "@material-ui/core";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import axiosObj from "../axios";
import { db } from "../utils/firebase";
import { onValue, push, ref } from "firebase/database";

const initialValues = {
  mobile: "",
  password: "",
};

function Login() {
  const [inCall, setInCall] = useState(false);
  const [values, setValues] = useState(initialValues);
  const [response_userId, setResponse_userId] = useState();
  const [isLogin, setIsLogin] = useState("");

  useEffect(() => {
    localStorage.getItem("isLogin") && (
      <Navigate to="/group-video-calling-app" />
    );
  }, [localStorage.getItem("isLogin")]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleJoinVideoCall = () => {
    setInCall(true);
  };

  const Push = async () => {
    const { mobile, password } = values;

    const res = await fetch(
      "https://agora-vc-default-rtdb.firebaseio.com/users.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          password,
        }),
      }
    );

    if (res) {
      console.log("Data Stored", res);
    } else {
      alert("Something went worng!!!");
    }
  };

  const getUserProfile = async () => {
    await axiosObj
      .get(`/userProfile/json/${localStorage.getItem("response_userId")}/false`)
      .then(response => {
        console.log(
          " getUserProfile response",
          localStorage.setItem("name", response?.data?.workerProfile[0].name)
        );
      });
  };

  const getUserDetails = async () => {
    await axiosObj
      .post("/userAuth/agoratoken", {
        userId: localStorage.getItem("response_userId"),
        channelName: "",
        eventId: 12,
      })
      .then(response => {
        localStorage.setItem("agoraToken", response?.data?.agoraToken);
        localStorage.setItem("appId", response?.data?.appId);
        localStorage.setItem("channelName", response?.data?.channelName);
        localStorage.setItem(" eventId", response?.data?.eventId);
        localStorage.setItem("role", response?.data?.role);
        console.log("getUserDetails", response.data);
      });

    setInCall(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .get(
        `https://iplfarmersamvad.com/CMSWSIPL/ws/userAuth/json/${values.mobile}/${values.password}`
      )
      .then(response => {
        if (response?.data?.valid === true) {
          localStorage.setItem("isLogin", true);
          setIsLogin(true);
          localStorage.setItem(
            "response_userId",
            response?.data?.response_userId
          );
          Push();
        } else {
          response?.data?.valid === false && alert("Invalid credentails!!");
        }
      })
      .catch(error => {
        console.error("There was an error!", error);
      });

    getUserDetails();
    setTimeout(() => {
      getUserProfile();
    }, 3000);

    localStorage.getItem("isLogin") && handleJoinVideoCall();
    setValues({
      mobile: "",
      password: "",
    });
  };

  useEffect(
    () => {},
    [localStorage.getItem("isLogin"), localStorage.getItem("agoraToken")],
    [isLogin]
  );

  return (
    <>
      {isLogin && <Navigate to="/group-video-calling-app" />}
      <Container maxWidth="xs">
        <Box pt={8}>
          <Box className="" component={Paper} p={2}>
            <Box pb={2}>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                margin="dense"
                placeholder="888 999 6612"
                required
                fullWidth
                name="mobile"
                label="Mobile"
                type="number"
                id="mobile"
                value={values.mobile}
                onChange={handleInputChange}
              />

              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                placeholder="*******"
                name="password"
                label="Password"
                id="password"
                value={values.password}
                type="password"
                onChange={handleInputChange}
              />

              <Button
                fullWidth
                disabled={
                  values.mobile.length < 10 || values.password.length === 0
                }
                style={{ marginTop: "24px", textTransform: "capitalize" }}
                variant="contained"
                color="primary"
                type="submit"
              >
                Login
              </Button>

              <Box pt={1}>
                <Typography>
                  Don't have an account ?{" "}
                  <span>
                    <Link to="/group-video-calling-app/signup">Sign Up</Link>
                  </span>
                </Typography>
              </Box>

              {/* <Grid container>
              <Grid item xs>
                <Button
                  disabled={values.mobile.length === 0}
                  style={{ marginTop: "24px", textTransform: "capitalize" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Login
                </Button>
              </Grid>
            </Grid> */}
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Login;
