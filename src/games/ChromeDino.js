import React, { useEffect, useState } from "react";
import { Button, Grid, Result } from "components/common";
import styled, { css, keyframes } from "styled-components";
import Joker from "assets/images/joker.jfif";
import Batman from "assets/gif/batman.gif";
import City from "assets/images/city.png";

const Dino = styled.div`
  width: 60px;
  height: 60px;
  background-image: url(${Batman});
  bottom: ${({ bottom }) => bottom}px;
  position: absolute;
  left: 80px;
  background-size: cover;
  background-position-x: center;
  mix-blend-mode: multiply;
  z-index: 5;
`;
const Obstacle = styled.div`
  position: absolute;
  width: 40px;
  height: 50px;
  background-image: url(${Joker});
  left: ${({ left }) => left}px;
  bottom: 0;
  background-size: cover;
  background-repeat: no-repeat;
  mix-blend-mode: multiply;
  z-index: 5;
`;
const Animate = keyframes`
0% { transform: translateX(0);}
50%{ transform :translateX(-400px);}
100%{ transform: translateX(0);}
`;
const Image = styled.img`
  height: 50%;
  margin-top: 30%;
  ${({ shouldAnimate }) =>
    shouldAnimate &&
    css`
    animation: ${Animate} 15s linear infinite};
`}
`;
const Score = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 50px;
  font-size: 24px;
`;
let jumpTimer = null;
let slideTimer = null;
let generateTimer = null;
const ChromeDino = () => {
  const dinoPosition = 80;
  const dinoWidth = 60;
  const obstacleHeight = 40;
  const [bottom, setBottom] = useState(0);
  const [jump, setJump] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [start, setStart] = useState(false);
  const gravity = 0.9;
  useEffect(() => {
    if (!start || gameOver) return;
    if (jump) {
      //going up
      jumpTimer = setTimeout(() => {
        let newBottom = bottom + 15;
        newBottom *= gravity;
        setBottom(newBottom);
      }, 20);
      if (bottom > 120) {
        clearTimeout(jumpTimer);
        setJump(false);
      }
    } else if (bottom > 0) {
      // coming down
      jumpTimer = setTimeout(() => {
        let newBottom = bottom - 10 < 0 ? 0 : bottom - 10;
        newBottom *= gravity;
        setBottom(newBottom);
      }, 20);
    } else {
      clearTimeout(jumpTimer);
    }
    return () => clearTimeout(jumpTimer);
  }, [jump, bottom, gameOver, start]);
  const generateObstacles = () => {
    if (start && !gameOver) {
      let obstaclePosition = 400;
      setObstacles((prev) => [...prev, obstaclePosition]);
      let min = 2000;
      let max = 3000;
      let randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
      generateTimer = setTimeout(() => {
        generateObstacles();
      }, randomTime);
    }
  };

  useEffect(() => {
    generateObstacles();
  }, [gameOver, start]);
  useEffect(() => {
    let isColidingPosition = obstacles.find(
      (e) => e > dinoPosition && e < dinoPosition + dinoWidth
    );
    if (isColidingPosition && bottom <= obstacleHeight) {
      setGameOver(true);
      clearTimeout(generateTimer);
    }
  }, [obstacles, bottom]);

  useEffect(() => {
    if (start && !gameOver && obstacles.length) {
      slideTimer = setTimeout(() => {
        let newPosition = [...obstacles].map((value) => value - 30);
        let newScore = newPosition.filter((value) => value <= 0 - 30).length;
        newPosition = newPosition.filter((value) => value > 0 - 30);
        setScore((prev) => prev + newScore);
        setObstacles(newPosition);
      }, 100);
    }
    return () => {
      clearTimeout(slideTimer);
    };
  }, [obstacles, gameOver, start]);

  const control = (e) => {
    if ([" ", "ArrowUp"].includes(e.key)) {
      if (!bottom) setJump(true);
    }
  };
  useEffect(() => {
    if (start) window.addEventListener("keydown", control);
    return () => window.removeEventListener("keydown", control);
  }, [bottom, start]);
  const toggleGame = () => {
    if (start) {
      setStart(false);
    } else {
      setBottom(0);
      setJump(false);
      clearTimeout(generateTimer);
      setObstacles([]);
      setGameOver(false);
      setScore(0);
      setStart(true);
    }
  };
  return (
    <div>
      <Grid border={"black"}>
        <Dino bottom={bottom} />
        {obstacles.map((left, i) => (
          <Obstacle key={i} left={left} />
        ))}
        {score ? <Score>score : {score}</Score> : ""}
        <Image src={City} shouldAnimate={start && !gameOver} />
      </Grid>
      <Button onClick={toggleGame}>{start ? "Stop" : "Start"}</Button>
      {gameOver ? <Result>Game Over!!!</Result> : ""}
    </div>
  );
};

export default ChromeDino;
