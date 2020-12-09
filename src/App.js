import { Title } from 'components/common';
import JumpSlide from 'games/JumpSlide';
import { MemoryGame } from 'games/MemoryGame';
import Minesweeper from 'games/Minesweeper';
import SnakeGame from 'games/SnakeGame';
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
const App = () => {
  const games = [
    { title: 'Snake Game', Game: <SnakeGame/> },
    { title: 'Minesweeper', Game: <Minesweeper/> },
    // { title: 'Jump Slide', Game: <JumpSlide/> },
    { title: 'Memory Game', Game: <MemoryGame/> }
  ]
  return (<Grid>
    {games.map(({title,Game})=><Container key={title}><Title>{title}</Title>{Game}</Container>)}
  </Grid>)
}

export default App
