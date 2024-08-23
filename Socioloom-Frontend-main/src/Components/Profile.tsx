import "./Profile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Post from "./Post";
import { useCallback, useEffect, useRef, useState } from "react";
import EditProfileModal from "./EditProfileModal";
import axios from "axios";
import userPlaceholder from "../assets/user.jpg";
import useLoadPosts from "../Hooks/useLoadPosts";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useNavigate } from "react-router-dom";

interface Props {
  profileId: number | undefined;
}

function Profile({ profileId }: Props) {
  const [pageNumber, setpageNumber] = useState(1);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [follow, setFollow] = useState(false);
  const [user, setUser] = useState({
    username: "",
    displayName: "",
    bio: "",
    profilePicture: "",
    coverPicture: "",
  });
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/follow/${profileId}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        setFollow(res.data.following);
      });
  }, [profileId]);
  const { loading, error, posts, hasMore } = useLoadPosts(
    pageNumber,
    "personal",
    profileId
  );

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useCallback(
    (node: any) => {
      // console.log("node", node);
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // console.log("entries", entries);
        if (entries[0].isIntersecting && hasMore) {
          console.log("Visible");
          setpageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
      // console.log("node", node);
    },
    [loading, hasMore]
  );
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/user/${profileId}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setUser({
          username: res.data.username,
          displayName: res.data.displayName,
          bio: res.data.bio,
          profilePicture: res.data.profilePicture,
          coverPicture: res.data.coverPicture,
        });
      });
  }, []);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  let isCurrentUser = false;
  if (userId) isCurrentUser = parseInt(userId) === profileId;

  return (
    <>
      <div className="profile">
        <div className="profile__header">
          <button className="profile__back__button">
            <ArrowBackIcon />
          </button>
          <h2>{user.displayName}</h2>
        </div>
        <div className="profile__section">
          {user.coverPicture ? (
            <img
              className="cover__photo"
              src={`data:image/png;base64,${user.coverPicture}`}
              alt=""
            />
          ) : (
            <div className="cover__photo__placeholder"></div>
          )}
          {user.profilePicture ? (
            <img
              className="profile__photo"
              src={`data:image/png;base64,${user.profilePicture}`}
              alt=""
            />
          ) : (
            <img className="profile__photo" src={userPlaceholder} alt="" />
          )}
          {isCurrentUser && (
            <button
              className="edit-profile-btn"
              onClick={() => {
                console.log("clicked");
                setOpenEditModal(true);
              }}
            >
              Edit Profile
            </button>
          )}
          {!isCurrentUser && (
            <div className="profile__buttons">
              <div
                onClick={() => {
                  console.log("clicked IN MESSAGE");
                  axios
                    .get(
                      `http://localhost:3000/api/chat/getChatId/${profileId}`,
                      {
                        headers: {
                          "x-auth-token": localStorage.getItem("token"),
                        },
                      }
                    )
                    .then((res) => {
                      console.log(res.data);
                      navigate("/chat/" + res.data.chatId);
                    });
                }}
                className="profile__button__message"
              >
                <MailOutlineIcon />
              </div>
              <button
                onClick={() => {
                  console.log("clicked IN FOLLOW");
                  axios
                    .post(
                      `http://localhost:3000/api/follow/${profileId}`,
                      { follow: !follow },
                      {
                        headers: {
                          "x-auth-token": localStorage.getItem("token"),
                        },
                      }
                    )
                    .then((res) => {
                      console.log(res);
                      setFollow(!follow);
                    });
                }}
                className={
                  follow
                    ? "profile__button__followed"
                    : "profile__button__follow"
                }
              >
                {follow ? "Unfollow" : "Follow"}
              </button>
            </div>
          )}
          <div className="user__details">
            <h1>{user.displayName}</h1>
            <p className="profile__username">@{user.username}</p>
            <p>{user.bio}</p>
          </div>
        </div>
        <div className="profile__post__header">Posts</div>
        {posts.map((post, index) => {
          const postComponent = (
            <div key={index}>
              <Post
                username={post.username}
                displayName={post.display_name}
                text={post.post_text}
                timestamp={post.time_posted}
                liked={post.user_liked}
                likeCount={post.like_count}
                replyCount={post.reply_count}
                image={post.post_image}
                avatar={post.profile_picture}
                profileId={post.user_id}
                postId={post.post_id}
              />
            </div>
          );

          if (posts.length === index + 1) {
            return (
              <div key={index} ref={lastPostElementRef}>
                {postComponent}
              </div>
            );
          } else {
            return postComponent;
          }
        })}
        <div>{loading && "Loading..."}</div>
        <div>{error && "Error"}</div>
      </div>
      {openEditModal && (
        <EditProfileModal
          bio={user.bio}
          displayName={user.displayName}
          coverPhoto={user.coverPicture}
          profilePhoto={user.profilePicture}
          setOpenModal={setOpenEditModal}
        />
      )}
    </>
  );
}

export default Profile;
