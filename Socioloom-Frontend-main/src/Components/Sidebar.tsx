import "./Sidebar.css";
import SidebarOption from "./SidebarOption";
import { IoMdHome } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoMail } from "react-icons/io5";
import { MdOutlinePermIdentity } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoggedContext } from "../App";
import LogoutIcon from "@mui/icons-material/Logout";
import socioloom from "../assets/fiber.png";

function Sidebar() {
  const naviagte = useNavigate();
  const logOut = useContext(LoggedContext);
  return (
    <div className="sidebar">
      <img className="sidebar__socioloomIcon" src={socioloom} />
      <SidebarOption active={false} text="Home" Icon={IoMdHome}></SidebarOption>
      <SidebarOption
        active={false}
        text="Explore"
        Icon={IoSearch}
      ></SidebarOption>
      {/* <SidebarOption
        active={false}
        text="Notifications"
        Icon={IoIosNotificationsOutline}
      ></SidebarOption> */}
      <SidebarOption
        active={false}
        text="Messages"
        Icon={IoMail}
      ></SidebarOption>
      <SidebarOption
        active={false}
        text="Profile"
        Icon={MdOutlinePermIdentity}
      ></SidebarOption>
      <button
        className="sidebar__logout"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          naviagte("/");
          logOut();
        }}
      >
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;
