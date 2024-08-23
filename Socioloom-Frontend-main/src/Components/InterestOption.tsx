import axios from "axios";
import "./InterestOption.css";
import { useState } from "react";

interface Props {
  id: number;
  subscribed: boolean;
  name: string;
}

function interestOption({ id, subscribed, name }: Props) {
  const [sub, setSub] = useState<boolean>(subscribed);
  return (
    <div className="interestOption">
      <div className="interestOption__name">{name}</div>
      <button
        onClick={() => {
          axios
            .post(
              `http://localhost:3000/api/interests/${id}`,
              { subscribe: !sub },
              {
                headers: {
                  "x-auth-token": localStorage.getItem("token"),
                },
              }
            )
            .then(() => {
              setSub(!sub);
            });
        }}
        className={
          sub ? "interestOption__button__followed" : "interestOption__button"
        }
      >
        {sub ? "Unsubscribe" : "Subscribe"}
      </button>
    </div>
  );
}

export default interestOption;
