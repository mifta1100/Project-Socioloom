import "./ReplyBox.css";
import { Avatar } from "@mui/material";
import CircularProgress from "./CircularProgress";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  postId: number;
  postType: string; // "Personal" or "Interest"
}

function ReplyBox({ postId, postType }: Props) {
  const [percent, setPercent] = useState(0);
  const { register, handleSubmit, reset } = useForm();
  const [profilePicture, setProfilePicture] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${userId}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setProfilePicture(res.data.profilePicture);
      });
  }, []);
  let location = useLocation();
  const axiosReplyLink = location.pathname.includes("/interests")
    ? `http://localhost:3000/api/replies/interests/${postId}`
    : `http://localhost:3000/api/replies/personal/${postId}`;
  const userId = localStorage.getItem("userId");
  const submitForm = (data: FieldValues) => {
    setIsSubmitting(true);

    axios
      .post(axiosReplyLink, data, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        setIsSubmitting(false);
        setPercent(0);
        setIsValid(false);
        reset();
        refreshPage();
      });
  };

  const navigate = useNavigate();

  const refreshPage = () => {
    navigate(0);
  };

  return (
    <div className="replyBox">
      <form action="" onSubmit={handleSubmit(submitForm)}>
        <div className="replyBox__input">
          {profilePicture ? (
            <Avatar src={`data:image/png;base64,${profilePicture}`} />
          ) : (
            <Avatar />
          )}
          <input
            {...register("ReplyText")}
            onChange={(data) => {
              setPercent((data.target.value.length / 300) * 100);
              if (
                data.target.value.length > 0 &&
                data.target.value.length <= 300
              ) {
                setIsValid(true);
              } else {
                setIsValid(false);
              }
            }}
            placeholder="Post your reply"
            type="text"
          />
        </div>
        <div className="replyBox__footer">
          <CircularProgress percent={percent} />
          <button
            disabled={isSubmitting || !isValid}
            type="submit"
            className="replyBox__tweetButton"
          >
            Reply
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReplyBox;
