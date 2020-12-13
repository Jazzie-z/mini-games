import { Button, Grid } from "components/common";
import React, { useEffect, useState } from "react";
import Candy1 from "assets/images/candy_1.png";
import Candy2 from "assets/images/candy_2.png";
import Candy3 from "assets/images/candy_3.png";
import Candy4 from "assets/images/candy_4.png";
import Candy5 from "assets/images/candy_5.png";
import Candy6 from "assets/images/candy_6.png";
import BgImg from "assets/images/cupcake_bg.jpg";
import Confetti from "assets/gif/confetti.gif";
import styled, { css, keyframes } from "styled-components";

const ShakeAnim = keyframes`
    0% { transform: translateX(0px) }
    10% { transform: translateX(2px) }
    20% { transform: translateX(4px) }
    30% { transform: translateX(6px) }
    40% { transform: translateX(4px) }
    50% { transform: translateX(2px) }
    60% { transform: translateX(0px) }
    70% { transform: translateX(2px) }
    80% { transform: translateX(4px) }
    90% { transform: translateX(6px) }
    100% { transform: translateX(8px) }
`;
const Shake = css`
  animation: ${ShakeAnim} 0.2s infinite;
`;
const ZoomAnim = keyframes`
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
`;
const Active = css`
  border: 2px solid white;
  animation: ${ZoomAnim} 1s infinite;
  background: #5d7ea8;
`;
const CandyImage = styled.img`
  width: 50px;
  height: 50px;
  padding: 2.5px;
  box-sizing: border-box;
  :hover {
    border: ${({ scale }) => (scale ? "none" : "2px solid white")};
  }
  ${({ active }) => active && Active};
  ${({ shake }) => shake && Shake};
  transform: scale(${({ scale }) => scale});
`;
const Score = styled.div`
  background: #dd7c95;
  color: white;
  border-radius: 50%;
  height: 45px;
  width: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid #c90707;
  box-sizing: border-box;
  margin: 10px;
`;
const Background = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: -1;
  filter: blur(1px);
`;

const CANDIES = [
  { id: 1, img: Candy1, score: 50 },
  { id: 2, img: Candy2, score: 60 },
  { id: 3, img: Candy3, score: 70 },
  { id: 4, img: Candy4, score: 80 },
  { id: 5, img: Candy5, score: 90 },
  { id: 6, img: Candy6, score: 10 },
];
let matchTimer = null;
let fillTimer = null;
let shakeTimer = null;
const CandyCrush = () => {
  const width = 8;
  const [candyArray, setCandyArray] = useState([]);
  const [start, setStart] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [shake, setShake] = useState([]);
  const fillArrayWithCandies = () => {
    const newArray = [...Array(width * width)].map(
      () => CANDIES[Math.floor(Math.random() * CANDIES.length)]
    );
    newArray[7] = CANDIES[0];
    newArray[8] = CANDIES[0];
    newArray[9] = CANDIES[0];
    setCandyArray(newArray);
  };
  const clearTimer = () => {
    clearTimeout(matchTimer);
    clearTimeout(fillTimer);
    clearTimeout(shakeTimer);
  };
  const restartGame = () => {
    setScore(0);
    clearTimer();
    setShake([]);
    setActiveIndex(null);
    fillArrayWithCandies();
  };
  useEffect(() => {
    restartGame();
  }, []);

  const isValidCombo = (array, index) => {
    let combo = [
      [index, index + 1, index + 2],
      [index - 1, index, index + 1],
      [index - 2, index - 1, index],
      [index, index + width, index + 2 * width],
      [index - width, index, index + width],
      [index - 2 * width, index - width, index],
    ];
    const isSameRow = (a, b, c) =>
      Math.floor(a / width) === Math.floor(b / width) &&
      Math.floor(a / width) === Math.floor(c / width);
    const isSameCol = (a, b, c) =>
      Math.floor(a / width) !== Math.floor(b / width) &&
      Math.floor(a / width) !== Math.floor(c / width) &&
      Math.floor(b / width) !== Math.floor(c / width);
    return combo.find(
      ([a, b, c]) =>
        (isSameCol(a, b, c) || isSameRow(a, b, c)) &&
        array[a]?.id &&
        array[a]?.id === array[b]?.id &&
        array[a]?.id === array[c]?.id
    );
  };
  const findValidMatch = () => {
    matchTimer = setTimeout(() => {
      let removableIndices;
      for (let i = 0; i < candyArray.length; i++) {
        removableIndices = isValidCombo(candyArray, i);
        if (removableIndices) {
          break;
        }
      }
      if (removableIndices) {
        let newCandyArray = [...candyArray];
        setScore((prev) => prev + newCandyArray[removableIndices[0]].score);
        removableIndices.forEach(
          (e) => (newCandyArray[e] = { img: Confetti, scale: 2.5 })
        );
        setCandyArray(newCandyArray);
      }
    }, 150);
  };
  useEffect(() => {
    findValidMatch();
    return () => clearTimeout(matchTimer);
  }, [candyArray]);
  const getNextNonEmptyIndex = (array, index) => {
    let newIndex = -1;
    for (let i = 1; i < width; i++) {
      if (array[index - i * width]?.id) {
        newIndex = index - i * width;
        break;
      }
    }
    return newIndex;
  };
  const fillEmptyArray = (array) =>
    array.map((e) =>
      e.id ? e : CANDIES[Math.floor(Math.random() * CANDIES.length)]
    );
  const moveArrayDown = () => {
    fillTimer = setTimeout(() => {
      let newCandyArray = [...candyArray];
      let shouldChange = false;
      for (let i = candyArray.length - 1; i >= width; i--) {
        if (!newCandyArray[i].id) {
          let newIndex = getNextNonEmptyIndex(newCandyArray, i);
          if (newIndex !== -1) {
            shouldChange = [newIndex, i];
            newCandyArray[i] = newCandyArray[newIndex];
            newCandyArray[newIndex] = {};
          }
        }
      }
      if (shouldChange) {
        newCandyArray = fillEmptyArray(newCandyArray);
        setCandyArray(newCandyArray);
      } else {
        let isEmptyArrayPresent = newCandyArray.find((e) => !e.id);
        if (isEmptyArrayPresent) {
          newCandyArray = fillEmptyArray(newCandyArray);
          setCandyArray(newCandyArray);
        }
      }
    }, 1000);
  };
  useEffect(() => {
    moveArrayDown();
    return () => clearTimeout(fillTimer);
  }, [candyArray]);

  useEffect(() => {
    if (shake.length) {
      shakeTimer = setTimeout(() => {
        setShake([]);
      }, 200);
    }
    return () => clearTimeout(shakeTimer);
  }, [shake]);

  const swapCandies = (index, newIndex) => {
    let newArray = [...candyArray];
    let temp = newArray[index];
    newArray[index] = newArray[newIndex];
    newArray[newIndex] = temp;
    let validNewIndex = [index + 1, index - 1, index + width, index - width];
    if (validNewIndex.includes(newIndex)) {
      if (isValidCombo(newArray, index) || isValidCombo(newArray, newIndex)) {
        setCandyArray(newArray);
        setActiveIndex(null);
      } else {
        setShake([index, newIndex]);
      }
    } else {
      setActiveIndex(newIndex);
    }
  };
  const onClickHandler = (index) => {
    if (activeIndex === index) return;
    if (activeIndex !== null) {
      swapCandies(activeIndex, index);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <div>
      <Grid color={"rgb(4 114 208 / 50%)"}>
        {candyArray.map(({ img, scale }, i) => (
          <CandyImage
            onClick={() => onClickHandler(i)}
            key={i}
            src={img}
            scale={scale}
            active={activeIndex === i}
            shake={shake.includes(i)}
          />
        ))}
        <Background src={BgImg} />
      </Grid>
      <Score>{score}</Score>
      <Button onClick={restartGame}>(Re)Start</Button>
    </div>
  );
};

export default CandyCrush;
