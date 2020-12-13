// MatterStepOne.js
import React, { useEffect, useRef } from "react";
import Matter from "matter-js";
import { Button } from "components/common";
import BirdBg from "assets/images/bird_bg.jpg";
import AngryBirdImg from "assets/images/angry_bird.png";
import styled from "styled-components";
let engine = null;
let render = null;
const Container = styled.div`
  canvas {
    background-image: url(${BirdBg});
    background-image: url(/mini-games/static/media/bird_bg.c767fb0b.jpg) !important;
    background-size: contain;
  }
`;
export const AngryBird = () => {
  const boxRef = useRef(null);
  const createCanvas = () => {
    engine = Matter.Engine.create();
    render = Matter.Render.create({
      element: boxRef.current,
      engine,
      options: {
        wireframes: false,
        width: 1240,
        height: 400,
        showAngleIndicator: true,
        showCollisions: true,
        showInternalEdges: false,
      },
    });
    let ground = Matter.Bodies.rectangle(600, 250, 250, 20, { isStatic: true }); //(x,y,width,height,{isStatic: wont affect by force})
    let ground2 = Matter.Bodies.rectangle(1000, 250, 350, 20, {
      isStatic: true,
    });
    // let wall1 = Matter.Bodies.rectangle(0, 600, 60, 1300, { isStatic: true });
    // let wall2 = Matter.Bodies.rectangle(810, 600, 60, 1300, { isStatic: true });
    // let boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
    // let boxB = Matter.Bodies.rectangle(450, 350, 80, 80);

    let mouse = Matter.Mouse.create(render.canvas);
    let mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        render: { visible: false },
      },
    });
    render.mouse = mouse;

    let shooterPosition = { x: 150, y: 250 };
    const angryBird = {
      render: {
        sprite: {
          texture: AngryBirdImg, //'https://assets.stickpng.com/images/584c69846e7d5809d2fa6366.png',
          xScale: 0.05,
          yScale: 0.05,
        },
      },
    };
    let ball = Matter.Bodies.circle(
      shooterPosition.x,
      shooterPosition.y,
      20,
      angryBird
    );
    let sling = Matter.Constraint.create({
      pointA: shooterPosition, //{ x: 300, y: 600 },
      bodyB: ball,
      stiffness: 0.05,
    });
    let stack = Matter.Composites.stack(535, 30, 4, 4, 30, 0, (x, y) => {
      // let sides = Math.round(Matter.Common.random(2,8))
      // return Matter.Bodies.polygon(x, y, sides, Matter.Common.random(20,50))
      return Matter.Bodies.rectangle(x, y, 20, 40);
    });
    let stack2 = Matter.Composites.stack(900, 30, 2, 8, 0, 0, (x, y) => {
      return Matter.Bodies.rectangle(x, y, 20, 20);
    });
    var stack3 = Matter.Composites.pyramid(
      850,
      30,
      15,
      15,
      0,
      0,
      function (x, y) {
        return Matter.Bodies.rectangle(x, y, 20, 20);
      }
    );
    let firing = false;
    Matter.Events.on(mouseConstraint, "enddrag", function (e) {
      if (e.body === ball) firing = true;
    });
    Matter.Events.on(engine, "afterUpdate", function () {
      if (
        firing &&
        Math.abs(ball.position.x - shooterPosition.x) < 20 &&
        Math.abs(ball.position.y - shooterPosition.y) < 20
      ) {
        ball = Matter.Bodies.circle(
          shooterPosition.x,
          shooterPosition.y,
          20,
          angryBird
        );
        Matter.World.add(engine.world, ball);
        sling.bodyB = ball;
        firing = false;
      }
    });
    Matter.World.add(engine.world, [
      stack,
      // stack2,
      stack3,
      ground,
      ground2,
      ball,
      sling,
      mouseConstraint,
    ]);
    Matter.Engine.run(engine);
    Matter.Render.run(render);
  };
  useEffect(() => {
    createCanvas();
  }, []);
  const reStartGame = () => {
    Matter.Engine.clear(engine);
    Matter.Render.stop(render);
    render.canvas.remove();
    render.canvas = null;
    render.context = null;
    render.textures = {};
    createCanvas();
  };
  return (
    <Container>
      <div
        ref={boxRef}
        style={{
          width: 1240,
          height: 400,
        }}
      ></div>
      <Button onClick={reStartGame}>ReStart</Button>
    </Container>
  );
};
