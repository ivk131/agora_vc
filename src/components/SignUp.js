import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Paper,
  Button,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const initialValues = {
  name: "",
  mobile: "",
  stateId: null,
  districtID: null,
  password: "",
  confirmPassword: "",
};

function SignUp() {
  const [values, setValues] = useState(initialValues);
  const [inCall, setInCall] = useState(false);
  const [isError, setError] = useState(false);
  const [stateId, setStateId] = useState(null);
  const [states, setStates] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [isSignup, setIsSignUp] = useState(false);
  const handleJoinVideoCall = () => {
    setInCall(true);
  };

  useEffect(() => {
    if (localStorage.getItem("isLogin")) {
      setIsSignUp(true);
    }
    axios
      .get("https://iplfarmersamvad.com/CMSWSIPL/ws/stateList/json")
      .then(response => {
        setStates(response?.data?.StateList);
      })
      .catch(error => console.log(("Fetch statelist failed", error)));

    values.stateId &&
      axios
        .get(
          `https://iplfarmersamvad.com/CMSWSIPL/ws/districtList/json/${values.stateId}`
        )
        .then(response => {
          setDistrictList(response?.data?.districtList);
        })
        .catch(error => console.log("Something Went wrong!!!", error));
  }, [values.stateId]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  console.log("value", values);

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .post(
        "https://iplfarmersamvad.com/CMSWSIPL/ws/volunteer/json/volunteerSave",
        values
      )
      .then(response => {
        response.data.msg === "mobile_exist" ? setError(true) : setError(false);
        response.data.msg === "mobile_exist" &&
          alert("Mobile Number already exits");

        response.data.msg === "success" && alert("Registered Successfully");
        response.data.msg === "success" &&
          setIsSignUp(true) &&
          setValues({
            name: "",
            mobile: "",
            stateId: null,
            districtID: null,
            password: "",
            confirmPassword: "",
          });
      })
      .catch(error => {
        console.error("There was an error!", error);
      });
  };

  return (
    <>
      {isSignup && <Navigate to="/login" replace />}
      <Container maxWidth="xs">
        <Box pt={8}>
          <Box className="" component={Paper} p={2}>
            <Box pb={2}>
              <Typography component="h1" variant="h5">
                Sign Up
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                variant="outlined"
                placeholder="Full Name"
                margin="dense"
                required
                fullWidth
                name="name"
                label="Full Name"
                id="name"
                autoComplete="current-password"
                value={values.name}
                onChange={handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="mobile"
                placeholder="888 999 2128"
                label="Mobile"
                type="number"
                id="mobile"
                value={values.mobile}
                onChange={handleInputChange}
              />

              <FormControl variant="outlined" margin="dense" fullWidth>
                <InputLabel id="select__state">State(Optional)</InputLabel>
                <Select
                  labelId="stateList"
                  id="stateList_id"
                  value={values.stateId}
                  name="stateId"
                  onChange={handleInputChange}
                  label="State(Optional)"
                  MenuProps={MenuProps}
                >
                  {states.map(state => (
                    <MenuItem key={state.stateID} value={state.stateID}>
                      {state.stateName}{" "}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl variant="outlined" margin="dense" fullWidth>
                <InputLabel id="select__state">District(optional)</InputLabel>
                <Select
                  // onClick={handleAPI_Call}
                  labelId="District(optional)"
                  id="District(optional)"
                  value={values.districtID}
                  name="districtID"
                  onChange={handleInputChange}
                  label="District(optional)"
                  MenuProps={MenuProps}
                >
                  {districtList.map(district => (
                    <MenuItem
                      key={district.districtID}
                      value={district.districtID}
                    >
                      {district.districtName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="password"
                label="Password"
                placeholder="*********"
                id="password"
                value={values.password}
                type="password"
                onChange={handleInputChange}
              />

              <TextField
                variant="outlined"
                margin="dense"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                placeholder="*********"
                id="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleInputChange}
              />

              <Button
                fullWidth
                disabled={
                  values.name.length === 0 ||
                  values.mobile.length < 10 ||
                  values.password.length === 0 ||
                  values.confirmPassword.length === 0
                }
                style={{ marginTop: "24px", textTransform: "capitalize" }}
                variant="contained"
                color="primary"
                type="submit"
              >
                SignUp
              </Button>

              <Box pt={1}>
                <Typography>
                  Already have an account ?{" "}
                  <span>
                    <Link to="/login">Login</Link>
                  </span>
                </Typography>
              </Box>

              <Grid container>
                <Grid item xs></Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default SignUp;
