import { Title } from 'components/common';
import JumpSlide from 'games/JumpSlide';
import { MemoryGame } from 'games/MemoryGame';
import Minesweeper from 'games/Minesweeper';
import SnakeGame from 'games/SnakeGame';
import SpaceInvaders from 'games/SpaceInvaders';
import styled from 'styled-components';

const Grid = styled.div`
display:flex;
flex-wrap:wrap;
font-family: sans-serif;
>div{
  margin: 10px;
}
`
const Container = styled.div`
`
window.addEventListener("keydown", function(e) {
  // disable arrow keys scrolling
  if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown",].includes(e.key)) {
      e.preventDefault();
  }
}, false);

const App = () => {
  const games = [
    { title: 'Snake Game', Game: <SnakeGame/> },
    { title: 'Minesweeper', Game: <Minesweeper/> },
    // { title: 'Jump Slide', Game: <JumpSlide/> },
    { title: 'Memory Game', Game: <MemoryGame/> },
    { title: 'Space Invaders', Game: <SpaceInvaders/> }
  ]
  return (<Grid>
    {games.map(({title,Game})=><Container key={title}><Title>{title}</Title>{Game}</Container>)}
  </Grid>)
}

export default App
