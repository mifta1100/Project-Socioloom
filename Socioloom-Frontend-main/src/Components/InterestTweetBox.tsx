import React, { useEffect, useRef, useState } from "react";
import "./InterestTweetBox.css";
import { Avatar } from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "./CircularProgress";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function InterestTweetBox() {
  const [currentImage, setCurrentImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>("");
  const myComponentRef = useRef<HTMLInputElement | null>(null);
  const [percent, setPercent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [profilePicture, setProfilePicture] = useState("");
  const [interests, setInterests] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/interests", {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setInterests(res.data);
      });
  }, []);

  const { register, handleSubmit, reset } = useForm();

  const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files as FileList;
    setCurrentImage(selectedFiles?.[0]);
    setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
  };
  const navigate = useNavigate();

  const refreshPage = () => {
    navigate(0);
  };

  const submitForm = (data: FieldValues) => {
    setIsSubmitting(true);
    console.log("Before append", data);
    console.log("Current image", currentImage);
    console.log("PostText", data.PostText);
    console.log("Interest", data.interest);
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("PostPicture", currentImage as File);
    formData.append("PostText", data.PostText);
    formData.append("PostInterest", data.interest);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    axios
      .post("http://localhost:3000/api/posts/interests", formData, {
        headers: {
          "x-auth-token": token,
        },
      })
      .then((res) => {
        console.log(res);
        setCurrentImage(undefined);
        setPreviewImage("");
        setIsSubmitting(false);
        setPercent(0);
        setIsValid(false);
        reset();
        refreshPage();
      });
  };

  const userId = localStorage.getItem("userId");

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

  return (
    <div className="interestTweetBox">
      <form action="" onSubmit={handleSubmit(submitForm)}>
        <div className="interestTweetBox__input">
          {profilePicture ? (
            <Avatar src={`data:image/png;base64,${profilePicture}`} />
          ) : (
            <Avatar />
          )}
          <input
            {...register("PostText")}
            placeholder="What's happening?"
            type="text"
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
            autoComplete="off"
          />
        </div>
        {previewImage && (
          <div className="interestTweetBox__preview">
            <img
              className="interestTweetBox__preview__image"
              src={previewImage}
              alt=""
            />
            <div
              onClick={() => {
                setPreviewImage("");
                setCurrentImage(undefined);
              }}
              className="interestTweetBox__preview__close"
            >
              <CloseIcon fontSize="small" />
            </div>
          </div>
        )}
        <div className="interestTweetBox__footer">
          <div className="interstTweetBox__option">
            <select id="interest" {...register("interest")}>
              {interests.map((interest) => (
                <option key={interest.interest_id} value={interest.interest_id}>
                  {interest.title}
                </option>
              ))}
            </select>
          </div>
          <div
            onClick={() => {
              if (myComponentRef && myComponentRef.current) {
                (myComponentRef.current as HTMLInputElement).click();
              }
            }}
            className="interestTweetBox__photoIcon"
          >
            {!previewImage && <PhotoIcon />}
            <input
              ref={myComponentRef}
              style={{ display: "none" }}
              onChange={selectImage}
              type="file"
              accept="image/*"
            />
          </div>
          <CircularProgress percent={percent} />
          <button
            disabled={isSubmitting || (!isValid && previewImage === "")}
            type="submit"
            className="interestTweetBox__tweetButton"
          >
            Tweet
          </button>
        </div>
      </form>
    </div>
  );
}

export default InterestTweetBox;
