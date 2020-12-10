import React, { useEffect, useState } from "react";
import styled from "styled-components";
const Game = styled.div``;
const Character = styled.div`
  background-color: red;
  height: 70px;
  width: 40px;
  position: absolute;
  bottom: ${({ bottom }) => bottom}px;
  left: ${({ left }) => left}px;
`;
let jumpTimer = null;
let slideTimer = null;
const JumpSlide = () => {
  const gravity = 0.9;
  const [bottom, setBottom] = useState(0);
  const [jump, setJump] = useState(false);
  const [left, setLeft] = useState(0);
  const [slide, setSlide] = useState("");
  const keyHandler = (e) => {
    if (e.key === " " && bottom <= 0) setJump(true);
    if (e.key === "ArrowLeft") setSlide("LEFT");
    else if (e.key === "ArrowRight") setSlide("RIGHT");
    else if (e.key === "ArrowDown") setSlide("");
  };
  useEffect(() => {
    // if (bottom) {
    if (slide === "RIGHT") {
      clearTimeout(slideTimer);
      slideTimer = setTimeout(() => {
        let newLeft = left + 5;
        setLeft(newLeft);
      }, 20);
      // if (bottom == 0) setSlide('')
    } else if (slide === "LEFT") {
      clearTimeout(slideTimer);
      slideTimer = setTimeout(() => {
        let newLeft = left - 5;
        setLeft(newLeft);
      }, 20);
      // if (bottom == 0) setSlide('')
    } else {
      setSlide("");
      clearTimeout(slideTimer);
    }
    // } else {
    //     setSlide('')
    //     clearTimeout(slideTimer)
    // }
  }, [slide, left, bottom]);
  useEffect(() => {
    //going up
    if (jump) {
      console.error("going to jumping");
      jumpTimer = setTimeout(() => {
        let newBottom = bottom + 30;
        newBottom *= gravity;
        setBottom(newBottom);
        console.error(bottom * gravity);
      }, 20);
      if (bottom > 250) {
        clearTimeout(jumpTimer);
        setJump(false);
      }
    } else if (bottom > 0) {
      console.error("coming back");
      jumpTimer = setTimeout(() => {
        let newBottom = bottom - 5 < 0 ? 0 : bottom - 5;
        setBottom(newBottom);
      }, 20);
    } else {
      console.error("just clearing", bottom);
      clearTimeout(jumpTimer);
    }
  }, [jump, bottom]);

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [bottom]);
  return (
    <Game>
      <Character bottom={bottom} left={left} />
    </Game>
  );
};

export default JumpSlide;
