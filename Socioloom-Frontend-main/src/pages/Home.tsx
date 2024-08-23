import Sidebar from "../Components/Sidebar";
import Feed from "../Components/Feed";
import "./Home.css";
import Widgets from "../Components/Widgets";
import { useEffect, useState } from "react";
import Profile from "../Components/Profile";
import Explore from "../Components/Explore";
import { useLocation, useParams } from "react-router-dom";
import Messages from "../Components/Messages";
import Chat from "../Components/Chat";
import PostView from "../Components/PostView";
import Notifications from "../Components/Notifications";

interface Props {
  urlPath?: string;
}

function Home({ urlPath }: Props) {
  const [path, setPath] = useState(urlPath ? urlPath : "home");
  let location = useLocation();

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/home") {
      setPath("home");
    } else if (location.pathname.includes("/profile")) {
      setPath("profile");
    } else if (location.pathname === "/explore") {
      setPath("explore");
    } else if (location.pathname === "/messages") {
      setPath("messages");
    } else if (location.pathname.includes("/chat")) {
      setPath("chat");
    } else if (location.pathname === "/notifications") {
      setPath("notifications");
    } else if (location.pathname.includes("/post")) {
      setPath("post");
    }
  }, [location]);

  const getProfileId = () => {
    let id = -1;
    const { profileId } = useParams();
    if (profileId) id = parseInt(profileId);
    return id;
  };
  return (
    <div className="home">
      <Sidebar />
      {path === "home" && <Feed />}
      {path === "profile" && <Profile profileId={getProfileId()} />}
      {path === "explore" && <Explore />}
      {path === "messages" && <Messages />}
      {path === "chat" && <Chat />}
      {path === "notifications" && <Notifications />}
      {path === "post" && <PostView />}
      <Widgets />
    </div>
  );
}

export default Home;
