import { Button, Grid, Result } from "components/common";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import AlienImage from "assets/images/alien.png";
import Jet from "assets/images/jet.png";
import ExplosionGif from "assets/gif/explosion.gif";
import Sound from "assets/sounds/laser.mp3";

const Shooter = css`
  background-image: url(${Jet});
  background-size: cover;
`;
const Invader = css`
  background-image: url(${AlienImage});
  background-size: contain;
`;
const Explosion = css`
  background-image: url(${ExplosionGif});
  background-size: contain;
  z-index: 2;
  position: relative;
`;
const Laser = css`
  background-color: yellow;
  box-shadow: 0px 0px 16px 7px #ffae00;
  z-index: 2;
  position: relative;
  width: 5px;
  height: 10px;
  margin: 0 auto;
`;
const Cell = styled.div`
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  ${({ isInvader }) => isInvader && Invader};
  ${({ isShooter }) => isShooter && Shooter};
  ${({ isLaser }) => isLaser && Laser};
  ${({ isExplosion }) => isExplosion && Explosion};
`;
let timer = null;
let laserTimer = null;
const SpaceInvaders = () => {
  const width = 20;
  const totalAlien = 33;
  const [shooterIndex, setShooterIndex] = useState(385);
  const [explodeIndex, setExplodeIndex] = useState("");
  const [direction, setDirection] = useState(1);
  const [alienGroup, setAlienGroup] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [laserIndex, setLaserIndex] = useState("");
  const [start, setStart] = useState(false);
  useEffect(() => {
    // prettier-ignore
    let alienLayout = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20,
      21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 40,
      41, 42, 43, 44, 45, 46, 47, 48, 49, 50,];
    setDirection(1);
    setAlienGroup(alienLayout);
  }, [start]);
  const moveShooter = (e) => {
    if (!start) return;
    switch (e.key) {
      case "ArrowRight":
        if (shooterIndex % width < width - 1) setShooterIndex(shooterIndex + 1);
        break;
      case "ArrowLeft":
        if (shooterIndex % width) setShooterIndex(shooterIndex - 1);
        break;
      case "ArrowUp":
        shoot();
        break;
    }
  };
  const moveInvaders = () => {
    const leftEdge = alienGroup[0] % width === 0;
    // const rightEdge = (alienGroup[alienGroup.length - 1] % width === width - 1)
    const rightEdge = alienGroup.find((alien) => alien % width === width - 1);
    let newDirection = direction;
    if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
      newDirection = width;
    } else if (direction === width) {
      if (leftEdge) newDirection = 1;
      else newDirection = -1;
    }
    setDirection(newDirection);
    setAlienGroup((prev) => prev.map((e) => e + newDirection));
  };
  const shoot = () => {
    var birdSound = new Audio(Sound);
    birdSound.loop = false;
    birdSound.play();
    setLaserIndex(shooterIndex - width);
  };
  useEffect(() => {
    if (laserIndex) {
      if (alienGroup.includes(laserIndex)) {
        setExplodeIndex(laserIndex);
        let newAlien = [...alienGroup];
        newAlien.splice(newAlien.indexOf(laserIndex), 1);
        console.error(laserIndex, newAlien);
        setLaserIndex("");
        setAlienGroup(newAlien);
        setTimeout(() => {
          setExplodeIndex("");
        }, 250);
      } else {
        laserTimer = setTimeout(() => {
          setLaserIndex((prev) => prev - width);
        }, 50);
      }
    }
    return () => clearTimeout(laserTimer);
  }, [laserIndex]);

  useEffect(() => {
    if (start) {
      if (alienGroup.includes(shooterIndex)) {
        setGameOver("GAME OVER");
        clearTimeout(timer);
      } else if (!alienGroup.length) {
        setGameOver("SUCCESS");
        clearTimeout(timer);
      } else {
        timer = setTimeout(() => {
          moveInvaders();
        }, 500);
      }
    } else {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [alienGroup]);
  useEffect(() => {
    window.addEventListener("keydown", moveShooter);
    return () => window.removeEventListener("keydown", moveShooter);
  }, [shooterIndex, alienGroup, direction]);
  const toggleGame = () => {
    setStart((prev) => !prev);
  };
  return (
    <div>
      <Grid color={"black"}>
        {[...Array(width * width)].map((e, i) => (
          <Cell
            key={i}
            isInvader={alienGroup.includes(i)}
            isShooter={shooterIndex === i}
            isLaser={laserIndex === i}
            isExplosion={explodeIndex === i}
          ></Cell>
        ))}
      </Grid>
      <Button onClick={toggleGame}>{start ? "STOP" : "Start"}</Button>
      {gameOver ? <Result>{gameOver}</Result> : ""}
      <div>your score : {totalAlien - alienGroup.length}</div>
    </div>
  );
};

export default SpaceInvaders;
