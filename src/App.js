import { useEffect, useState } from "react";
import "./App.css";
import Board from "./components/Board";
import { Input } from "@mui/material";
import { setKey } from "./logic/game";
import { setHighScore, setUserId, setName } from "./state";
import { useDispatch, useSelector } from "react-redux";
import { ColorRing } from "react-loader-spinner";
import Modal from "./components/Modal";
import { VscDebugRestart } from "react-icons/vsc";
import { MdLeaderboard } from "react-icons/md";

function App() {
  const [score, setScore] = useState(0);
  // const [highScore, setHighScore] = useState(0);
  const [gameoverState, setGameoverState] = useState(false);
  const [time, setTime] = useState(0);
  const [isSubmit, setIsSubmit] = useState("false");
  const [rank, setRank] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const highScore = useSelector((state) => state.highScore);
  const userId = useSelector((state) => state.userId);
  const name = useSelector((state) => state.name);
  const dispatch = useDispatch();
  let prevKey = "";
  const [breakHighScore, setBreakHighScore] = useState(false);

  const restart = () => {
    window.location.reload();
  };

  const doJoystick = (e) => {
    const temp = e.target.className[12];
    switch (temp) {
      case "u":
        if (prevKey !== "ArrowDown") setKey("ArrowUp");
        break;
      case "d":
        if (prevKey !== "ArrowUp") setKey("ArrowDown");
        break;
      case "l":
        if (prevKey !== "ArrowRight") setKey("ArrowLeft");
        break;
      case "r":
        if (prevKey !== "ArrowLeft") setKey("ArrowRight");
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit("loading");
    const name = e.target[0].value;
    const data = {
      name,
      score,
      time,
    };

    if (userId == 0) {
      const formResponse = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const response = await formResponse.json();
      console.log(response);
      dispatch(setUserId({ userId: response.userId }));
      dispatch(setName({ name: response.name }));
      setIsSubmit("true");
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
      setIsSubmit("true");
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
      console.log(breakHighScore);
      if (!breakHighScore) {
        const audio = new Audio("break-highscore-sound.wav");
        audio.play();
        setBreakHighScore(true);
      }
    }
  }, [score]);

  useEffect(() => {
    if (gameoverState) {
      scrollToSection("bottom");
    }
  }, [gameoverState]);

  useEffect(() => {
    const invokeServer = async () => {
      const response = fetch(`${process.env.REACT_APP_SERVER_URL}/records`);
      const data = await response.json();
    }
    invokeServer();
  }, []);

  return (
    <div className="App">
      <div className="main-left">
        <Board
          setScore={setScore}
          setGameoverState={setGameoverState}
          setTime={setTime}
          prevKey={prevKey}
        />
        <div className="main-left-bottom">
          <button className="btn play-btn" onClick={() => setIsModalOpen(true)}>
            <MdLeaderboard style={{ position: "relative", top: "0.2rem" }} />
            <span className="btn-text">{" "}RECORDS</span>
          </button>
          <div className="joystick">
            <button className="joy-btn joy-up" onClick={doJoystick}></button>
            <button className="joy-btn joy-down" onClick={doJoystick}></button>
            <button className="joy-btn joy-left" onClick={doJoystick}></button>
            <button className="joy-btn joy-right" onClick={doJoystick}></button>
          </div>
          <button className="btn restart-btn" onClick={restart}>
          <span className="btn-text">RESTART{" "}</span>
            <VscDebugRestart style={{ position: "relative", top: "0.2rem" }} />
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
              required
            />
            {/* <button type="button" className="name-reset-btn" onClick={resetName}>Hi</button> */}
            {isSubmit === "true" ? (
              <div className="submit-after">
                World Rank: <span className="score-data">{rank}</span>
              </div>
            ) : (
              <button type="submit" className="submit-btn" id="bottom">
                Submit
                <ColorRing
                  visible={isSubmit === "loading" ? true : false}
                  height="40"
                  width="40"
                  ariaLabel="color-ring-loading"
                  wrapperStyle={{
                    position: "absolute",
                    top: "0",
                    right: "0.6rem",
                  }}
                  wrapperClass="color-ring-wrapper"
                  colors={[
                    "#e15b64",
                    "#f47e60",
                    "#f8b26a",
                    "#abbd81",
                    "#849b87",
                  ]}
                />
              </button>
            )}
          </form>
        </div>
      </div>
      {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
    </div>
  );
}

export default App;
