import React, { useEffect, useState } from "react";
import { Button, Grid, Result } from "components/common";
import styled from "styled-components";
import BirdImg from "assets/gif/bird.gif";
import BackgroundImg from "assets/images/grassland.jpg";
import Pipe from "assets/images/pipe.png";

const Bird = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: ${({ bottom }) => bottom}px;
  background-image: url(${BirdImg});
  background-size: cover;
  background-position: center;
  left: 150px;
  transform: rotate(${({ bottom }) => 0.225 * (200 - bottom)}deg);
  z-index: 2;
`;
const Obstacle = styled.img`
  width: 30px;
  height: 200px;
  position: absolute;
  bottom: ${({ bottom }) => bottom}px;
  z-index: 2;
  transform: rotate(${({ invert }) => (invert ? 0 : 180)}deg);
  left: ${({ left }) => left}px;
`;
const Floor = styled.div`
  height: 60px;
  width: 100%;
  position: absolute;
  bottom: 0;
  overflow: hidden;
  img {
    width: 100%;
    height: 400px;
    transform: translateY(-340px);
    z-index: 5;
    position: relative;
  }
`;
const Image = styled.img`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`;
const Score = styled.div`
  position: absolute;
  font-size: 24px;
  padding: 10px;
  color: white;
  z-index: 3;
  border: 4px solid white;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px;
`;
let gravityTimer = null;
let slideTimer = null;
let generateTimer = null;
let flyTimer = null;
const FlappyBird = () => {
  const floorHeight = 60;
  const gravity = 0.9;
  const birdSize = 30;
  const birdPos = 150;
  const pipeSize = 200;
  const verticalGap = 100;
  const [bottom, setBottom] = useState(200);
  const [start, setStart] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [fly, setFly] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  useEffect(() => {
    if (!gameOver && start && bottom) {
      gravityTimer = setTimeout(() => {
        let newBottom = fly ? bottom + 7.5 : bottom - 2.5;
        setBottom(newBottom);
      }, 20);
    }
    return () => {
      clearTimeout(gravityTimer);
    };
  }, [start, bottom, fly, gameOver]);

  const generateObstacle = () => {
    if (start && !gameOver) {
      let obstaclePosition = 400;
      let height = Math.floor(Math.random() * floorHeight);
      setObstacles((prev) => [...prev, { left: obstaclePosition, height }]);
      let min = 800;
      let max = 3000;
      let randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
      generateTimer = setTimeout(() => {
        generateObstacle();
      }, randomTime);
    }
  };
  useEffect(() => {
    generateObstacle();
  }, [start, gameOver]);

  useEffect(() => {
    if (!gameOver && start && obstacles.length) {
      slideTimer = setTimeout(() => {
        let newPosition = [...obstacles].map(({ left, height }) => ({
          left: left - 10,
          height,
        }));
        newPosition = newPosition.filter(({ left }) => left > 0 - 30);
        let newScore = newPosition.filter(
          ({ left }) => left < birdPos && left >= birdPos - 10
        ).length;
        setScore((prev) => prev + newScore);
        setObstacles(newPosition);
      }, 80);
    }
    return () => {
      clearTimeout(slideTimer);
    };
  }, [obstacles, start, gameOver]);

  useEffect(() => {
    if (start && !gameOver) {
      if (bottom <= floorHeight) {
        //REACHED FLOOR
        setGameOver("GAME OVER!!!");
        stopTimer();
      } else {
        let nearestObstacle = obstacles.find(
          (e) => e.left >= birdPos && e.left <= birdPos + birdSize
        );
        if (nearestObstacle) {
          if (
            bottom <= pipeSize + nearestObstacle.height ||
            bottom + birdSize >= pipeSize + nearestObstacle.height + verticalGap
          ) {
            setGameOver("GAME OVER!!!");
            stopTimer();
          }
        }
      }
    }
  }, [obstacles, bottom, start]);
  const keyHandler = (e) => {
    if (["ArrowUp", " "].includes(e.key)) {
      setFly(true);
      clearTimeout(flyTimer);
      flyTimer = setTimeout(() => {
        setFly(false);
      }, 150);
    }
  };
  useEffect(() => {
    if (start && !gameOver) window.addEventListener("keydown", keyHandler);
    return () => window.addEventListener("keydown", keyHandler);
  }, [start, gameOver]);
  const stopTimer = () => {
    clearTimeout(generateTimer);
    clearTimeout(slideTimer);
    clearTimeout(flyTimer);
    clearTimeout(gravityTimer);
  };
  const toggleGame = () => {
    if (start) {
      setStart(false);
    } else {
      setGameOver(false);
      setObstacles([]);
      setBottom(200);
      setScore(0);
      setFly(false);
      setStart(true);
    }
    stopTimer();
  };
  return (
    <div>
      <Grid border={"black"}>
        <div>
          <Bird bottom={bottom} />
        </div>
        {obstacles.map(({ left, height }, i) => (
          <Obstacle key={i} left={left} bottom={height} src={Pipe} />
        ))}
        {obstacles.map(({ left, height }, i) => (
          <Obstacle
            key={i}
            left={left}
            bottom={pipeSize + height + verticalGap}
            src={Pipe}
            invert={true}
          />
        ))}
        <Image src={BackgroundImg} />
        <Floor>
          <img src={BackgroundImg}></img>
        </Floor>
        <Score>{score}</Score>
      </Grid>
      <Button onClick={toggleGame}>{start ? "Stop" : "Start"}</Button>
      {gameOver ? <Result>{gameOver}</Result> : ""}
    </div>
  );
};

export default FlappyBird;
