import React, { useState, useEffect } from "react";
import { getFormattedTime } from "./services";
export default function Timer({setTimeRemaining}) {
  const sidebysidestyle = { "text-align": "center" };
  const childdiv = {
    display: "inline-block",
    width: "50%",
    "vertical-align": "top",
    borderRadius: "25px", 
    marginTop: "5px"
  };

  const duration = 1000 * 60 * 20;

  const [timer, setTimer] = useState(duration);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (isStarted) {
      setTimeout(() => {
        setTimer(timer - 1000);
        setTimeRemaining(timer);
      }, 1000);
    }
  }, [timer]);

  const onClickStart = () => {
    setIsStarted(true);
    setTimer(timer-1000)
  }

  return (
    <div style={sidebysidestyle}>
        <button onClick={onClickStart} style={childdiv}>Start</button>{" "}
        <h2 style={childdiv}>{getFormattedTime(timer)}</h2>
    </div>
  );
}
