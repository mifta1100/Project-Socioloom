import { useCallback, useRef, useState } from "react";
import "./Explore.css";
import SearchIcon from "@mui/icons-material/Search";
import Post from "./Post";
import People from "./People";
import useExplore from "../Hooks/useExplore";

function Explore() {
  const [contentType, setContentType] = useState("people");
  const [pageNumber, setpageNumber] = useState(1);
  const [search, setSearch] = useState("");

  const { loading, error, posts, hasMore } = useExplore(
    pageNumber,
    contentType,
    search
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

  return (
    <div className="explore">
      <div className="explore__header">
        <div className="explore__input">
          <SearchIcon className="explore__searchIcon" />
          <input
            placeholder="Search Socioloom"
            type="text"
            value={search}
            onChange={(event) => {
              setpageNumber(1);
              setSearch(event.target.value);
            }}
          />
        </div>
        <div className="explore__header__nav">
          <button
            onClick={() => {
              setContentType("personal");
              setpageNumber(1);
            }}
            className="feed__buttons"
          >
            <div
              className={
                contentType === "personal"
                  ? "feed__buttons__text__active"
                  : "feed__buttons__text"
              }
            >
              Personal
            </div>
          </button>
          <button
            onClick={() => {
              setContentType("interests");
              setpageNumber(1);
            }}
            className="feed__buttons"
          >
            <div
              className={
                contentType === "interests"
                  ? "feed__buttons__text__active"
                  : "feed__buttons__text"
              }
            >
              Interests
            </div>
          </button>
          <button
            onClick={() => {
              setContentType("people");
              setpageNumber(1);
            }}
            className="feed__buttons"
          >
            <div
              className={
                contentType === "people"
                  ? "feed__buttons__text__active"
                  : "feed__buttons__text"
              }
            >
              People
            </div>
          </button>
        </div>
      </div>
      {posts.map((post, index) => {
        if (contentType === "people") {
          const peopleComponent = (
            <People
              displayName={post.display_name}
              username={post.username}
              bio={post.bio}
              avatar={post.profile_picture}
              profileId={post.user_id}
              followed={post.followed}
            />
          );

          if (posts.length === index + 1) {
            return (
              <div key={index} ref={lastPostElementRef}>
                {peopleComponent}
              </div>
            );
          } else {
            return <div key={index}>{peopleComponent}</div>;
          }
        } else if (contentType === "personal") {
          const postComponent = (
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
          );

          if (posts.length === index + 1) {
            return (
              <div key={index} ref={lastPostElementRef}>
                {postComponent}
              </div>
            );
          } else {
            return <div key={index}>{postComponent}</div>;
          }
        } else if (contentType === "interests") {
          const postComponent = (
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
              interest={post.title}
            />
          );

          if (posts.length === index + 1) {
            return (
              <div key={index} ref={lastPostElementRef}>
                {postComponent}
              </div>
            );
          } else {
            return <div key={index}>{postComponent}</div>;
          }
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
}

export default Explore;
