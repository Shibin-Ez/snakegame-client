import { useEffect, useState } from "react";
import "./styles.css";
import { getKey, setKey } from "../logic/game";

const Board = ({ setScore, setGameoverState, setTime, prevKey }) => {
  const rows = 18;
  const cols = 18;

  let gameover = false;
  let start = false;

  const [grid, setGrid] = useState(
    Array(rows)
      .fill()
      .map(() => Array(cols).fill(0))
  );

  const initiate = () => {
    const newGrid = [...grid];
    newGrid[8][8] = 1; // snake head
    newGrid[8][7] = 1; // snake body
    newGrid[8][6] = 1; // snake body
    // newGrid[10][3] = 3; // food
    setGrid(newGrid);

    snake = [
      [8, 8],
      [8, 7],
      [8, 6],
    ];

    gameover = false;
    setGameoverState(false);
    setScore(0);
    generateFood();
  };

  let snake = [];

  const generateFood = () => {
    const freeSpaces = [];
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j] === 0) freeSpaces.push([i, j]);
      }
    }

    const randomIndex = Math.floor(Math.random() * freeSpaces.length);
    const [x, y] = freeSpaces[randomIndex];
    const newGrid = [...grid];
    newGrid[x][y] = 3;
    setGrid(newGrid);
  };

  const gameOver = () => {
    gameover = true;
    setGameoverState(true);
    const audio = new Audio("gameover-sound.mp3");
    audio.play();
  };

  let count = 0;
  const update = () => {
    if (getKey() == "") return;

    count++;
    if (count == 9) {
      setTime((prevTime) => prevTime + 1);
      count = 0;
    }

    const newGrid = [...grid];
    const tail = [snake[snake.length - 1][0], snake[snake.length - 1][1]];

    for (let i = snake.length - 1; i > 0; i--) {
      snake[i][0] = snake[i - 1][0];
      snake[i][1] = snake[i - 1][1];
    }

    if (getKey() === "ArrowUp" && prevKey !== "ArrowDown") {
      if (snake[0][0] > 0) snake[0][0]--;
      else gameOver();
    } else if (getKey() === "ArrowDown" && prevKey !== "ArrowUp") {
      if (snake[0][0] < rows - 1) snake[0][0]++;
      else gameOver();
    } else if (getKey() === "ArrowLeft" && prevKey !== "ArrowRight") {
      if (snake[0][1] > 0) snake[0][1]--;
      else gameOver();
    } else if (getKey() === "ArrowRight" && prevKey !== "ArrowLeft") {
      if (snake[0][1] < cols - 1) snake[0][1]++;
      else gameOver();
    } else {
      setKey(prevKey);
      update(prevKey);
    }

    if (newGrid[snake[0][0]][snake[0][1]] === 3) {
      // food eaten
      snake.push([tail[0], tail[1]]);
      generateFood();
      setScore((prevScore) => prevScore + 1);
      // eating sound
      const audio = new Audio("eating-sound.mp3");
      audio.play();
    } else if (newGrid[snake[0][0]][snake[0][1]] === 1) {
      // snake eats itself
      gameOver();
    } else {
      newGrid[tail[0]][tail[1]] = 0;
    }
    newGrid[snake[0][0]][snake[0][1]] = 1;
    setGrid(newGrid);
  };

  // let key = "";

  useEffect(() => {
    initiate();

    const interval = setInterval(() => {
      if (!gameover) update();
    }, 100);

    const handleKeyDown = (e) => {
      if (start === false && e.key === "ArrowLeft") return;

      const lastKey = getKey();
      if (e.key === "ArrowLeft" && lastKey === "ArrowRight") return;
      if (e.key === "ArrowRight" && lastKey === "ArrowLeft") return;
      if (e.key === "ArrowUp" && lastKey === "ArrowDown") return;
      if (e.key === "ArrowDown" && lastKey === "ArrowUp") return; 

      const allowedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
      if (allowedKeys.includes(e.key)) {
        start = true;
        prevKey = getKey();
        setKey(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  // useEffect(() => {
  //   key = Key;
  //   console.log(key);
  // }, [Key]);

  return (
    <div id="board">
      {/* <div className="cell" /> */}
      {grid.map((row, i) => {
        return (
          <div className="row">
            {row.map((cell, j) => {
              return <div className={`cell cell-${grid[i][j]}`} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
