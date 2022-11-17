import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import {
  Box,
  IconButton,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../utils/firebase";
import { onValue, ref } from "firebase/database";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const initialValues = {
  commentId: uuidv4(),
  Uid: 0,
  comment: "",
  image: "https://iplfarmersamvad.com/files/16633155061071663315503000.jpg",
  requestCode: 0,
  userID: "",
  userName: "",
  date: null,
};

const styles = makeStyles(() => ({
  modalContainer: {
    display: "flex",
    justifyContent: "right",
    position: "absolute",
    right: "8px",
    // padding: " 8px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

export default function ChatModal({
  openChat,
  setOpenOpenChat,
  handleOpenChatDialog,
  users,
}) {
  const [open, setOpen] = React.useState(false);
  const [comments, setComments] = useState([]);
  const [values, setValues] = useState(initialValues);
  const classes = styles();

  useEffect(() => {
    const dbRef = ref(db, "comments");
    onValue(dbRef, snapshort => {
      setComments([]);

      const data = snapshort.val();

      if (data !== null) {
        Object.values(data).map(item => {
          setComments(oldCommentArray => [...oldCommentArray, item]);
        });
      }

      // snapshort.forEach(childSnapshort => {
      //   let keyName = childSnapshort.key;
      //   let value = childSnapshort.val();
      //   comments.push({ key: keyName, value: value });
      // });
    });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // setOpen(false);
    setOpenOpenChat(false);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  {
  }

  const handleSunmit = async e => {
    e.preventDefault();

    const { commentId, Uid, comment, image, requestCode, userID, userName } =
      values;

    const res = await fetch(
      "https://agora-vc-default-rtdb.firebaseio.com/comments.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId: uuidv4(),
          Uid,
          comment,
          image,
          requestCode,
          userID: localStorage.getItem("response_userId"),
          userName: localStorage.getItem("name"),
          date: new Date(),
        }),
      }
    );

    if (res) {
      setValues({
        commentId: null,
        Uid: 0,
        comment: "",
        image: "",
        requestCode: null,
        userID: "",
        userName: "",
        date: null,
      });
      // console.log("Comment stored Data Stored", res);
    } else {
      alert("Something went worng!!!");
    }
  };

  return (
    <div>
      <Dialog
        open={openChat}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleOpenChatDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={classes.modalContainer}
      >
        <DialogContent>
          <Box style={{ height: "420px" }}>
            <Box className={classes.header}>
              <Typography variant="h6"> In-call messages</Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon fontSize="small" color="primary" />
              </IconButton>
            </Box>

            <Box
              style={{
                maxHeight: "360px",
                overflow: "auto",
                maxWidth: "320px",
                paddingRight: "8px",
              }}
            >
              {comments.map(comment => (
                <Box
                  key={comment.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "2px 0",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {comment?.userName}
                    </Typography>
                    <Typography variant="body2" style={{ marginLeft: "32px" }}>
                      {moment(comment?.date).format("h:mm:ss a")}
                      {/* {new Date(comment?.value?.date).getMinutes()} */}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography color="textSecondary">
                      {comment?.comment} {"  "}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <form onSubmit={handleSunmit}>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box style={{ display: "flex", position: "relative" }}>
                <TextField
                  fullWidth
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="Send a message to everyone"
                  name="comment"
                  value={values.comment}
                  size="small"
                />

                <IconButton
                  style={{ position: "absolute", right: "8px" }}
                  type="submit"
                  disabled={values.comment.length !== 0 ? false : true}
                  // onClick={handleClose}
                  color="primary"
                >
                  <SendIcon
                    fontSize="small"
                    color={values.comment && "primary"}
                  />
                </IconButton>
              </Box>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
