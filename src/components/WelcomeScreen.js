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

function WelcomeScreen() {
  const [inCall, setInCall] = useState(false);
  const [rejoin, setRejoin] = useState(false);

  useEffect(() => {
    localStorage.getItem("isLogin") && <Navigate to="/" />;
  }, []);

  const handleRejoin = () => {
    setRejoin(true);
  };

  return (
    <>
      {rejoin && <Navigate to="/login" />}
      <Container maxWidth="xs">
        <Box pt={8}>
          <Box className="" component={Paper} p={2}>
            <Box pb={2}>
              <Typography component="h1" variant="h5">
                You're left the meeting!!!
              </Typography>
            </Box>

            <Button
              fullWidth
              style={{ marginTop: "24px", textTransform: "capitalize" }}
              variant="contained"
              color="primary"
              onClick={handleRejoin}
            >
              Rejoin
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default WelcomeScreen;
