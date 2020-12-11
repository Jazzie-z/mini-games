import { Title } from "components/common";
import ChromeDino from "games/ChromeDino";
import FlappyBird from "games/FlappyBird";
import JumpSlide from "games/JumpSlide";
import { MemoryGame } from "games/MemoryGame";
import Minesweeper from "games/Minesweeper";
import SnakeGame from "games/SnakeGame";
import SpaceInvaders from "games/SpaceInvaders";
import Tetris from "games/Tetris";
import TicTacToe from "games/TicTacToe";
import Tenet from "games/Tenet";
import styled from "styled-components";
import Pacman from "games/Pacman";

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-family: sans-serif;
  > div {
    margin: 10px;
  }
`;
window.addEventListener(
  "keydown",
  function (e) {
    // disable arrow keys scrolling
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
  },
  false
);

const App = () => {
  const games = [
    { title: "Snake Game", Game: <SnakeGame /> },
    { title: "Minesweeper", Game: <Minesweeper /> },
    // { title: 'Jump Slide', Game: <JumpSlide/> },
    { title: "Memory Game", Game: <MemoryGame /> },
    { title: "Space Invaders", Game: <SpaceInvaders /> },
    { title: "Tic Tac Toe", Game: <TicTacToe /> },
    { title: "Chrome Dino", Game: <ChromeDino /> },
    { title: "Flappy Bird", Game: <FlappyBird /> },
    { title: "Tetris", Game: <Tetris /> },
    { title: "Tenet", Game: <Tenet /> },
    { title: "Pacman", Game: <Pacman /> },
  ];
  return (
    <Grid>
      {games.map(({ title, Game }) => (
        <div key={title}>
          <Title>{title}</Title>
          {Game}
        </div>
      ))}
    </Grid>
  );
};

export default App;
