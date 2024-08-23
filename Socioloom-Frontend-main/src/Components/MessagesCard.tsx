import "./MessagesCard.css";
import Avatar from "@mui/material/Avatar";
import profile from "./profile.jpg";
import { useNavigate } from "react-router-dom";
interface Props {
  chatId: number;
  name: string;
  username: string;
  avatar?: string;
}

function MessagesCard({ name, username, avatar, chatId }: Props) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/chat/${chatId}`);
      }}
      className="messagesCard"
    >
      <div className="messagesCard__pic">
        {avatar ? (
          <Avatar src={`data:image/png;base64,${avatar}`} />
        ) : (
          <Avatar />
        )}
      </div>
      <div className="messagesCard__details">
        <div>
          <span className="messageCard__display">{name}</span>{" "}
          <span className="messageCard__username">@{username} </span>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default MessagesCard;
