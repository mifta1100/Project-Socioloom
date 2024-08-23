import "./Reply.css";
import { Avatar } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
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
  replyId: number;
  displayName: string;
  username: string;
  timestamp: string;
  text: string;
  avatar?: string;
  likeCount: number;
  liked: boolean;
  profileId: number;
}

function Reply({
  replyId,
  displayName,
  username,
  text,
  timestamp,
  liked,
  likeCount,
  avatar,
  profileId,
}: Props) {
  const [likeStatus, setLikeStatus] = useState(liked);
  const dateTimeAgo = moment(timestamp).fromNow();
  let location = useLocation();
  const axiosReplyLikeLink = location.pathname.includes("/interests")
    ? `http://localhost:3000/api/likes/reply/interests/${replyId}`
    : `http://localhost:3000/api/likes/reply/personal/${replyId}`;

  const handleLike = (event: React.MouseEvent) => {
    event.preventDefault();
    axios
      .post(
        axiosReplyLikeLink,
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
    <div className="comment">
      <div className="comment__avatar">
        {avatar ? (
          <Avatar src={`data:image/png;base64,${avatar}`} />
        ) : (
          <Avatar />
        )}
      </div>
      <div className="comment__body">
        <div className="comment__header">
          <div className="comment__headerText">
            <h3>
              <Link
                to={`/profile/${profileId}`}
                className="comment__displayName"
              >
                {displayName}
              </Link>{" "}
              <span className="comment__headerSpecial">
                {/* <VerifiedUserIcon className="comment__badge" />  */}@
                {username} &#183;{" "}
                <span className="comment__headerTime">{dateTimeAgo}</span>
              </span>
            </h3>
          </div>
          <div className="comment__headerDescription">
            <p>{text}</p>
          </div>
        </div>
        <div className="comment__footer">
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
        </div>
      </div>
    </div>
  );
}

export default Reply;
