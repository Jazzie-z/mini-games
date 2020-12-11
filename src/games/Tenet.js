import { Button, Grid, Result } from "components/common";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Door from "assets/images/door.png";
import RedChar from "assets/images/char_red.png";
import BlueChar from "assets/images/char_blue.png";
import Machine from "assets/images/time_machine.png";
import ExitImg from "assets/images/exit.png";
const Container = styled.div`
  box-shadow: 0px 1px 41px 20px
    ${({ reverse }) => (reverse ? "#0075ff36" : "#ff000036")} inset;
`;
const Ceiling = styled.div`
  height: 10px;
  width: 20px;
  background: ${({ floor }) => (floor ? "black" : "grey")};
  position: absolute;
  bottom: ${({ bottom }) => bottom}px;
  left: ${({ left }) => left}px;
  transform: rotate(${({ rotate }) => rotate + "deg"});
`;
const Character = styled.img`
  height: 30px;

  position: absolute;
  bottom: ${({ bottom }) => bottom}px;
  left: ${({ left }) => left}px;
  z-index: 2;
`;
const TurnStile = styled.img`
  width: 50px;
  height: 50px;
  bottom: -2px;
  right: -5px;
  position: absolute;
  box-sizing: border-box;
  font-size: 10px;
`;
const Exit = styled.img`
  position: absolute;
  bottom: ${({ bottom }) => bottom}px;
  left: ${({ left }) => left}px;
  width: 40px;
  height: 80px;
`;
const Poster = styled.img`
  position: absolute;
  top: 20px;
  left: 150px;
  width: 80px;
`;
let gravityTimer = null;
let antiGravityTimer = null;
let playerGravityTimer = null;
let playerAntiGravityTimer = null;
let fallTimer = null;
const Tenet = () => {
  const [ceiling, setCeiling] = useState(
    [...Array(6)].map((e, i) => ({ id: i, bottom: 248, left: (i + 2) * 20 }))
  );
  let floor = [...Array(20)].map((e, i) => ({
    id: `floor${i}`,
    bottom: 248,
    left: i * 20,
    floor: true,
  }));
  floor = floor.filter((e) => !ceiling.find((i) => i.left == e.left));
  const [reverse, setReverse] = useState(false);
  const [bottom, setBottom] = useState(256);
  const [left, setLeft] = useState(0);
  const exitPosition = [258, 360];
  const [fall, setFall] = useState(false);
  const [fallTime, setFallTime] = useState(1100);
  const [gameOver, setGameOver] = useState(false);
  const [start, setStart] = useState(false);
  useEffect(() => {
    if (!reverse && start) {
      fallTimer = setTimeout(() => {
        setFall(true);
        setFallTime(new Date().getTime());
      }, fallTime);
    }
    return () => clearTimeout(fallTimer);
  }, [start]);
  useEffect(() => {
    if (reverse) {
      console.error("will be revesing in ", new Date().getTime() - fallTime);
      fallTimer = setTimeout(() => {
        console.error("reversing now");
        setFall(false);
      }, new Date().getTime() - fallTime);
    }
    return () => clearTimeout(fallTimer);
  }, [reverse]);
  useEffect(() => {
    //ceiling fall
    if (fall && reverse === false && ceiling.find((e) => e.bottom)) {
      gravityTimer = setTimeout(() => {
        let newCeiling = [...ceiling];
        let firstBrick = newCeiling.findIndex((e) => !e.broke);
        if (newCeiling[firstBrick]) {
          newCeiling[firstBrick].broke = true;
          newCeiling[firstBrick].rotate = Math.floor(Math.random() * 90);
        }
        newCeiling = newCeiling.map((e) =>
          e.broke ? { ...e, bottom: e.bottom - 8 >= 0 ? e.bottom - 8 : 0 } : e
        );
        setCeiling(newCeiling);
      }, 20);
    } else {
      clearTimeout(gravityTimer);
    }
    return () => clearTimeout(gravityTimer);
  }, [reverse, ceiling, fall]);
  useEffect(() => {
    //ceiling anti fall
    if (!fall && reverse && ceiling.find((e) => e.bottom < 248)) {
      let newCeiling = [...ceiling];
      antiGravityTimer = setTimeout(() => {
        let firstBrick = newCeiling.filter((e) => e.broke).pop();
        if (firstBrick) {
          firstBrick.broke = false;
        }
        newCeiling = newCeiling.map((e) =>
          !e.broke
            ? { ...e, bottom: e.bottom + 8 <= 248 ? e.bottom + 8 : 248 }
            : e
        );
        let topBrick = newCeiling
          .filter((e) => e.bottom === 248 && e.rotate)
          .pop();
        if (topBrick) {
          topBrick.rotate = 0;
        }
        setCeiling(newCeiling);
      }, 20);
    } else {
      // setReverse(false)
      clearTimeout(antiGravityTimer);
    }
    return () => clearTimeout(antiGravityTimer);
  }, [ceiling, reverse, fall]);

  useEffect(() => {
    if (fall && !reverse && bottom) {
      let fallAmount = 8;
      let floorPresent = floor.find(
        (e) =>
          e.bottom + fallAmount === bottom && [left - 10, left].includes(e.left)
      );
      // console.error(floor.find(e => [left - 10, left].includes(e.left)))
      // console.error(floor.find(e => (e.bottom + fallAmount) === bottom))
      if (!floorPresent) {
        playerGravityTimer = setTimeout(() => {
          setBottom((prev) => prev - 8);
        }, 20);
      }
    }
    return () => clearTimeout(playerGravityTimer);
  }, [reverse, fall, bottom, left]);

  useEffect(() => {
    if (!fall && reverse && bottom <= 248) {
      let fallAmount = 8;
      let floorPresent = ceiling.find(
        (e) =>
          [bottom, bottom + fallAmount].includes(e.bottom) &&
          [left - 10, left].includes(e.left)
      );
      if (floorPresent) {
        playerAntiGravityTimer = setTimeout(() => {
          setBottom((prev) => prev + 8);
        }, 15);
      }
    }
    return () => clearTimeout(playerAntiGravityTimer);
  }, [ceiling]);

  useEffect(() => {
    if (!fall) {
      let ceilPos = ceiling.filter((e) => e.bottom === 248).length;
      console.error("ceilPos", ceilPos, bottom, bottom < 256);
      if (ceilPos === ceiling.length && bottom < 256)
        setGameOver("FAILED! Try again");
    }
  }, [ceiling, floor, bottom, reverse]);

  const playerHandler = (e) => {
    const moveAmount = 10;
    if ((gameOver, !start)) return;
    switch (e.key) {
      case "ArrowRight": {
        if (left + moveAmount === 360 && bottom === 256)
          setGameOver("SUCCESS !!!");
        if (left + moveAmount === 360 && bottom === 0)
          setReverse((prev) => !prev);
        if (left + moveAmount <= 380) setLeft((prev) => prev + moveAmount);
        break;
      }
      case "ArrowLeft": {
        if (left - moveAmount > 0) setLeft((prev) => prev - moveAmount);
        break;
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", playerHandler);
    return () => window.removeEventListener("keydown", playerHandler);
  }, [left, bottom, start]);
  const resetGame = () => {
    setCeiling(
      [...Array(6)].map((e, i) => ({ id: i, bottom: 248, left: (i + 2) * 20 }))
    );
    setReverse(false);
    setBottom(256);
    setLeft(0);
    setFall(false);
    setFallTime(1100);
    setGameOver(false);
  };
  const toggleGame = () => {
    if (start) {
      setStart((prev) => !prev);
    } else {
      resetGame();
      setStart((prev) => !prev);
    }
  };
  return (
    <div>
      <Container reverse={reverse}>
        <Grid border={"black"}>
          {[...ceiling, ...floor].map(
            ({ id, bottom, left, rotate, floor }, i) => (
              <Ceiling
                key={id}
                bottom={bottom}
                left={left}
                floor={floor}
                rotate={rotate}
              ></Ceiling>
            )
          )}
          <Character
            bottom={bottom}
            left={left}
            src={reverse ? BlueChar : RedChar}
          ></Character>
          <TurnStile bottom={bottom} src={Machine}></TurnStile>
          <Exit
            src={Door}
            bottom={exitPosition[0]}
            left={exitPosition[1]}
          ></Exit>
          <Poster src={ExitImg} />
        </Grid>
      </Container>
      <Button onClick={toggleGame}>{start ? "Stop" : "Start"}</Button>
      {gameOver ? <Result>{gameOver}</Result> : ""}
    </div>
  );
};

export default Tenet;
