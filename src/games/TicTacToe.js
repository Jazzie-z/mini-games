import { Button, Result } from 'components/common'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Grid = styled.div`
    width: 400px;
    height: 400px;
    background: #32475b;
    display:flex;
    flex-wrap:wrap;
`
const Block = styled.div`
    border: 1px solid #3e5468;
    width: 133.33px;
    height: 133.33px;
    box-sizing: border-box;
    font-size: 100px;
    font-family: sans-serif;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center; 
`
const TicTacToe = () => {
    const [squares, setSquares] = useState([]);
    const [xIsNext, setxIsNext] = useState();
    const [gameOver, setGameOver] = useState(false)
    const resetGame = () => {
        setSquares([...Array(9)])
        setxIsNext(true)
        setGameOver(false)
    }
    useEffect(() => {
        resetGame()
    }, [])
    const calculateWinner = () => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }
    useEffect(() => {
        const winner = calculateWinner()
        if (winner) {
            setGameOver(`Winner is : ${winner}`)
        } else if (squares.length && !squares.includes(undefined)) {
            setGameOver(`Game Over !!!`)
        }
    }, [squares])
    const onClick = (i) => {
        const newSquares = [...squares];
        if (gameOver || newSquares[i]) return
        newSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(newSquares)
        setxIsNext(prev => !prev);
    }
    return (
        <div>
            <Grid>
                {squares.map((value, i) => <Block key={i} onClick={() => onClick(i)}>{value}</Block>)}
            </Grid>
            <Button onClick={resetGame}>RESTART</Button>
            {gameOver ? <Result>{gameOver}</Result> : ''}
        </div>
    )
}

export default TicTacToe
