import React from "react";
import PropTypes from "prop-types";
import cx from "clsx";
import { Typography, Avatar, Grid } from "@mui/material";
import ReactMarkdown from "react-markdown";

import withStyles from "@mui/styles/withStyles";
import defaultChatMsgStyles from "./defaultChatMsg.styles";

const ChatMsg = withStyles(defaultChatMsgStyles, { name: "ChatMsg" })(
  (props) => {
    const {
      classes,
      avatar,
      messages,
      side,
      GridContainerProps,
      GridItemProps,
      AvatarProps,
      getTypographyProps,
    } = props;
    const attachClass = (index) => {
      if (index === 0) {
        return classes[`${side}First`];
      }
      if (index === messages.length - 1) {
        return classes[`${side}Last`];
      }
      return "";
    };
    return (
      <Grid
        container
        spacing={1}
        justify={side === "right" ? "flex-end" : "flex-start"}
        {...GridContainerProps}
      >
        {side === "left" && (
          <Grid
            item
            xs={1}
            {...GridItemProps}
            style={{ display: "flex", flexDirection: "row-reverse" }}
          >
            <Avatar
              src={avatar}
              {...AvatarProps}
              className={cx(classes.avatar, AvatarProps.className)}
            />
          </Grid>
        )}
        <Grid item xs={11}>
          {messages.map((msg, i) => {
            const TypographyProps = getTypographyProps(msg, i, props);
            return (
              // eslint-disable-next-line react/no-array-index-key
              <div key={i} className={classes[`${side}Row`]}>
                <Typography
                  align={side}
                  {...TypographyProps}
                  className={cx(
                    classes.msg,
                    classes[side],
                    attachClass(i),
                    TypographyProps.className
                  )}
                >
                  <ReactMarkdown>{msg}</ReactMarkdown>
                </Typography>
              </div>
            );
          })}
        </Grid>
        {side === "right" && (
          <Grid item xs={1} {...GridItemProps}>
            <Avatar
              src={avatar}
              {...AvatarProps}
              className={cx(classes.avatar, AvatarProps.className)}
            />
          </Grid>
        )}
      </Grid>
    );
  }
);

ChatMsg.propTypes = {
  avatar: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  side: PropTypes.oneOf(["left", "right"]),
  GridContainerProps: PropTypes.shape({}),
  GridItemProps: PropTypes.shape({}),
  AvatarProps: PropTypes.shape({}),
  getTypographyProps: PropTypes.func,
};
ChatMsg.defaultProps = {
  avatar: "",
  messages: [],
  side: "left",
  GridContainerProps: {},
  GridItemProps: {},
  AvatarProps: {},
  getTypographyProps: () => ({}),
};

export default ChatMsg;
