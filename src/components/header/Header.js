import React from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Avatar,
  IconButton,
  Box,
} from "@material-ui/core";

function Header() {
  return (
    <>
      <AppBar color="inherit">
        <Toolbar>
          <Typography variant="h6">Logo</Typography>
          <Box flexGrow={1} />

          <Avatar />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
