import SearchIcon from "@mui/icons-material/Search";
import "./Messages.css";
import MessagesCard from "./MessagesCard";
import { useEffect, useState } from "react";
import axios from "axios";

function Messages() {
  const [messages, setMessages] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/chat/chatList`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("HERE_ + ", res.data);
        setMessages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="messages">
      <div className="messages__header">
        <h2>Messages</h2>
      </div>
      <div className="messages__input">
        <SearchIcon className="messages__searchIcon" />
        <input placeholder="Search Direct Messages" type="text" />
      </div>
      {messages.map((message) => {
        if (message.user_1 == localStorage.getItem("userId")) {
          return (
            <MessagesCard
              chatId={message.chat_id}
              key={message.user_2}
              name={message.disp2}
              avatar={message.pic2}
              username={message.username2}
            />
          );
        } else {
          return (
            <MessagesCard
              chatId={message.chat_id}
              key={message.user_1}
              name={message.disp1}
              avatar={message.pic1}
              username={message.username1}
            />
          );
        }
      })}
    </div>
  );
}

export default Messages;
