import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { Box, IconButton, TextField, Typography } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../utils/firebase";
import { onValue, ref } from "firebase/database";
import moment from "moment";

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
  userName: localStorage.getItem("name"),
  date: null,
};

export default function ChatModal({
  openChat,
  setOpenOpenChat,
  handleOpenChatDialog,
}) {
  const [open, setOpen] = React.useState(false);
  const [comments, setComments] = useState([]);
  const [values, setValues] = useState(initialValues);
  let records = [];

  useEffect(() => {
    const dbRef = ref(db, "comments");

    onValue(dbRef, snapshort => {
      snapshort.forEach(childSnapshort => {
        let keyName = childSnapshort.key;
        let value = childSnapshort.val();
        records.push({ key: keyName, value: value });
        console.log("Records---------------", records);
        setComments(records);
      });
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
          userID,
          userName,
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
      console.log("Comment stored Data Stored", res);
    } else {
      alert("Something went worng!!!");
    }
  };

  //   console.log("comment", values);
  console.log("comments--------------------------------", comments);

  return (
    <div>
      <Dialog
        open={openChat}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleOpenChatDialog}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        style={{
          display: "flex",
          justifyContent: "right",
          position: "absolute",
          right: "8px",
        }}
      >
        <DialogContent>
          <form onSubmit={handleSunmit}>
            <Box style={{ height: "340px" }}>
              <Box style={{ maxHeight: "280px" }}>
                {comments.map(comment => (
                  <Box
                    key={comment.key}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "2px 0",
                    }}
                  >
                    <Typography variant="subtitle">
                      {comment?.value?.userName} {"  "}
                    </Typography>
                    <Typography color="textSecondary">
                      {comment?.value?.comment} {"  "}
                    </Typography>
                    <Typography variant="body1">
                      {new Date(comment?.value?.date).getMinutes()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                onChange={handleInputChange}
                variant="outlined"
                placeholder="Enter something..."
                name="comment"
                value={values.comment}
              />

              <IconButton
                type="submit"
                disabled={values.comment.length !== 0 ? false : true}
                style={{ marginLeft: "8px" }}
                onClick={handleClose}
                color="primary"
              >
                <SendIcon color={values.comment && "primary"} />
              </IconButton>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
