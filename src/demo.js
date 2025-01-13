import * as React from "react";
import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Divider,
  Grid,
  TextField,
  Fab,
  CssBaseline,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import withStyles from "@mui/styles/withStyles";
import axios from "axios";
import ChatMsg from "./ChatMsg";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const [messages, setMessages] = React.useState([]);
  const [prompt, setPrompt] = React.useState("");

  React.useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("messages")) || [];
    const oneWeekAgo = new Date().getTime() - 7 * 24 * 60 * 60 * 1000; // one week in milliseconds
    const recentMessages = savedMessages.filter(
      (message) => message.timestamp >= oneWeekAgo
    );
    setMessages(recentMessages);
  }, []);

  React.useEffect(() => {
    console.log("messages", messages);
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
      // e.target.value = "";
    }
  };

  const onChange = (e) => {
    setPrompt(e.target.value);
  }

  const handleSubmit = async () => {

    console.log(">>>>>>>");

    const currentMsgs = [
      ...messages,
      {
        role: "user",
        content: prompt,
        timestamp: new Date().getTime(), // add a timestamp
      },
    ];
    setPrompt("");
    setMessages(currentMsgs);
    setTimeout(function () {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
    const result = await axios.post("http://47.253.197.95/backend/chat", {
      model: "llama3.1:70b",
      messages: JSON.stringify([
        ...messages,
        {
          role: "user",
          content: prompt,
        },
      ]),
    });

    setMessages([
      ...currentMsgs,
      { ...result.data, timestamp: new Date().getTime() },
    ]);
    setTimeout(function () {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            FTOZON chat
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Grid>
          <div
            style={{
              paddingBottom: "4rem",
            }}
          >
            {messages.map((message, inx) => (
              <ChatMsg
                key={inx}
                side={message.role === "user" ? "right" : "left"}
                avatar={""}
                messages={[message.content]}
              />
            ))}
          </div>

          <div
            style={{
              position: "fixed",
              width: "95%",
              bottom: 0,
              right: 0,
              paddingBottom: 10,
              maxWidth: "114rem",
              background: "white",
            }}
          >
            <Divider />
            <Grid container style={{ width: "100%" }}>
              <Grid item xs={11}>
                <TextField
                  onKeyDown={onKeyDown}
                  onChange={onChange}
                  value={prompt}
                  id="outlined-basic-email"
                  label="Type Something"
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid
                item
                xs={1}
                direction="row"
                alignItems="center"
                justify="flex-end"
              >
                <Fab
                  color="primary"
                  aria-label="add"
                  size="small"
                  onClick={() => handleSubmit()}
                >
                  <SendIcon />
                </Fab>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
  messages: PropTypes.arrayOf(PropTypes.string),
  side: PropTypes.oneOf(["left", "right"]),
};

ResponsiveDrawer.defaultProps = {
  messages: [],
  side: "left",
};

export default withStyles()(ResponsiveDrawer);
