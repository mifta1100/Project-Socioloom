import "./PostAlt.css";
import { Avatar } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PublishIcon from "@mui/icons-material/Publish";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s",
    s: "%ds",
    m: "%dm",
    mm: "%dm",
    h: "%dh",
    hh: "%dh",
    d: "%dd",
    dd: "%dd",
    M: "%dm",
    MM: "%dm",
    y: "%dy",
    yy: "%dy",
  },
});

interface Props {
  displayName: string;
  username: string;
  timestamp: string;
  text: string;
  image?: string;
  avatar?: string;
  likeCount: number;
  liked: boolean;
  replyCount: number;
  interest?: string;
  profileId: number;
  postId: number;
}

function PostAlt({
  displayName,
  username,
  text,
  timestamp,
  liked,
  likeCount,
  replyCount,
  image,
  avatar,
  interest,
  profileId,
  postId,
}: Props) {
  const [likeStatus, setLikeStatus] = useState(liked);
  const dateTimeAgo = moment(timestamp).fromNow();
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const axiosLikeLink = interest
    ? `http://localhost:3000/api/likes/post/interests/${postId}`
    : `http://localhost:3000/api/likes/post/personal/${postId}`;

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    axios
      .post(
        axiosLikeLink,
        { like: !likeStatus },
        {
          headers: {
            "x-auth-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        console.log(res);
        setLikeStatus(!likeStatus);
      });
  };

  return (
    <div className="postAlt">
      <div className="postAlt__body">
        <div className="postAlt__header">
          <div className="postAlt__avatar">
            {avatar ? (
              <Avatar src={`data:image/png;base64,${avatar}`} />
            ) : (
              <Avatar />
            )}
          </div>
          <div className="postAlt__headerText">
            <Link to={`/profile/${profileId}`} className="postAlt__displayname">
              {displayName}
            </Link>
            <div className="postAlt__headerSpecial">@{username}</div>
          </div>
          {interest && (
            <div className="post__headerInterest">
              {capitalizeFirstLetter(interest)}
            </div>
          )}
        </div>
        <div className="postAlt__postContent">
          <p>{text}</p>
        </div>
        <div className="postAlt__time">{dateTimeAgo}</div>
        {image && <img src={`data:image/png;base64,${image}`} alt="" />}
        <div className="post__footer">
          <div className="post__footer__icon">
            <ChatBubbleOutlineIcon fontSize="small" />
            {replyCount > 0 ? <span>{replyCount}</span> : null}
          </div>
          <div className="post__footer__info">
            <div
              onClick={(event) => handleLike(event)}
              className="post__footer__like"
            >
              {likeStatus ? (
                <FavoriteIcon fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </div>
            {likeCount > 0 ? <span>{likeCount}</span> : null}
          </div>
          <div className="post__footer__icon">
            <PublishIcon fontSize="small" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostAlt;
