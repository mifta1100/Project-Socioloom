import "./SidebarOption.css";
import { useNavigate } from "react-router-dom";

interface Props {
  active: boolean;
  text: string;
  Icon: any;
}

function SidebarOption({ active, text, Icon }: Props) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        if (text === "Profile")
          navigate("/profile/" + localStorage.getItem("userId"));
        else navigate("/" + text.toLowerCase());
      }}
      className={`sidebarOption ${active && `sidebarOption--active`}`}
    >
      <div className="icon">
        <Icon className="icon__icon" />
      </div>
      <h2>{text}</h2>
    </div>
  );
}

export default SidebarOption;
