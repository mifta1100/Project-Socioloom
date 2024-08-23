import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SendIcon from "@mui/icons-material/Send";
import "./Chat.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const socket = io("http://localhost:3000");

function Chat() {
  const { chatId } = useParams();
  const [myName, setMyName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const sendMessage = () => {
    console.log("Clicked send");
    socket.emit("send_message", {
      message: message,
      chatId: chatId,
      sender: userId,
    });
    setMessage("");
    setMessages((prev) => [...prev, { message: message, sender: userId }]);
  };
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected");
      socket.emit("join_room", { chatId: chatId });
    });
  }, []);
  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      console.log("Received message = ", data);
      setMessages((prev) => [
        ...prev,
        { message: data.message, sender: data.sender },
      ]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/chat/getChatInfo/${chatId}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.user_1 == userId) {
          setMyName(res.data.disp1);
          setOtherName(res.data.disp2);
        } else {
          setMyName(res.data.disp2);
          setOtherName(res.data.disp1);
        }
      });
  }, []);
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/chat/${chatId}`, {
        headers: {
          "x-auth-token": localStorage.getItem("token"),
        },
      })
      .then((res: any) => {
        console.log("GET MESSAGES = ", res.data);
        const arr = res.data.map((message: any) => {
          return { message: message.message_text, sender: message.sender };
        });
        setMessages(arr);
      });
  }, []);

  return (
    <div className="chat">
      <div className="chat__header">
        <button className="chat__back__button">
          <ArrowBackIcon />
        </button>
        <h2>{otherName}</h2>
      </div>
      <div className="chat__body">
        {messages.map((message, index) => {
          if (message.sender == userId) {
            return (
              <p key={index} className="chat__message chat__reciever">
                <span className="chat__name">{myName}</span>
                {message.message}
              </p>
            );
          } else {
            return (
              <p key={index} className="chat__message">
                <span className="chat__name">{otherName}</span>
                {message.message}
              </p>
            );
          }
        })}
      </div>

      <div></div>
      <div className="chat__footer">
        <div className="chat__input">
          <input
            placeholder="Start a new message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div onClick={sendMessage}>
            <SendIcon className="chat__sendIcon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
