import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import { Input } from "@mui/material";
import { setKey } from "./logic/game";
import { setHighScore, setUserId, setName } from "./state";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const [score, setScore] = useState(0);
  // const [highScore, setHighScore] = useState(0);
  const [gameoverState, setGameoverState] = useState(false);
  const [time, setTime] = useState(0);
  const [isSubmit, setIsSubmit] = useState(false);
  const [rank, setRank] = useState(0);
  const highScore = useSelector((state) => state.highScore);
  const userId = useSelector((state) => state.userId);
  const name = useSelector((state) => state.name);
  const dispatch = useDispatch();

  const restart = () => {
    window.location.reload();
  };

  const doJoystick = (e) => {
    const temp = e.target.className[12];
    switch (temp) {
      case "u":
        setKey("ArrowUp");
        break;
      case "d":
        setKey("ArrowDown");
        break;
      case "l":
        setKey("ArrowLeft");
        break;
      case "r":
        setKey("ArrowRight");
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target[0].value;
    const data = {
      name,
      score,
      time,
    };

    if (userId == 0) {
      const formResponse = await fetch(`${process.env.REACT_APP_SERVER_URL}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await formResponse.json();
      console.log(response);
      dispatch(setUserId({ userId: response.userId }));
      dispatch(setName({ name: response.name }));
      setIsSubmit(true);
      setRank(response.rank);
    } else {
      const formResponse = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/records/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const response = await formResponse.json();
      console.log(response);
      setIsSubmit(true);
      setRank(response.rank);
    }
  };

  const resetName = () => {
    dispatch(setUserId({ userId: 0 }));
    dispatch(setName({ name: "" }));
  };

  const scrollToSection = (id) => {
    const targetSection = document.getElementById(id);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (score > highScore) {
      dispatch(setHighScore({ highScore: score }));
    }
  }, [score]);

  useEffect(() => {
    if (gameoverState) {
      scrollToSection("bottom");
    }
  }, [gameoverState]);

  return (
    <div className="App">
      <div className="main-left">
        <Board
          setScore={setScore}
          setGameoverState={setGameoverState}
          setTime={setTime}
        />
        <div className="main-left-bottom">
          <button className="btn play-btn">PLAY</button>
          <div className="joystick">
            <button className="joy-btn joy-up" onClick={doJoystick}></button>
            <button className="joy-btn joy-down" onClick={doJoystick}></button>
            <button className="joy-btn joy-left" onClick={doJoystick}></button>
            <button className="joy-btn joy-right" onClick={doJoystick}></button>
          </div>
          <button className="btn restart-btn" onClick={restart}>
            RESTART
          </button>
        </div>
      </div>
      <div className="main-right">
        <div className="right-and-time">
          <div className="main-right-top">
            <div className="score">SCORE</div>
            <div className="score-text">{score}</div>
            <div className="high-score-text">High Score: {highScore}</div>
          </div>
          <div className="time">
            {time / 60 < 10
              ? "0" + Math.floor(time / 60)
              : Math.floor(time / 60)}
            :{time % 60 < 10 ? "0" + (time % 60) : time % 60}
          </div>
        </div>
        <div
          className="main-right-bottom"
          style={{ opacity: gameoverState ? 1 : 0 }}
        >
          <div className="score-text">GAME OVER</div>
          <ul>
            <li>
              Apple Eaten: <span className="score-data">{score}</span>
            </li>
            <li>
              Difficulty: <span className="score-data">Medium</span>
            </li>
            <li>
              Time:{" "}
              <span className="score-data">
                {Math.floor(time / 60)}m {time % 60}s
              </span>
            </li>
          </ul>

          <form onSubmit={handleSubmit}>
            Submit your score: <br />
            <Input
              placeholder="Type your Name"
              className="name-input"
              style={{ color: "white" }}
              defaultValue={name}
            />
            {/* <button type="button" className="name-reset-btn" onClick={resetName}>Hi</button> */}
            {isSubmit ? (
              <div className="submit-after">
                World Rank: <span className="score-data">{rank}</span>
              </div>
            ) : (
              <button type="submit" className="submit-btn" id="bottom">
                Submit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
