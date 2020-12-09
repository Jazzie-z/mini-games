import { Button, Result } from 'components/common'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

const Grid = styled.div`
height: 400px;
width: 400px;
display:flex;
flex-wrap:wrap;
background:#115481;
border:1px solid;
`
const Bomb = css`
    background:orange;
    font-size: 48px;
`
const Open = css`
    background:white;
    color:black;
    border: 3px inset #1C6EA4;
`
const Empty = css`
    background: #e1e1e1;
    border-color:#b1b1b1;
`
const Dash = css`
    background: red;
`
const Block = styled.div`
    height: 40px;
    width: 40px;
    display:flex;
    font-family:sans-serif;
    align-items:center;
    justify-content:center;
    font-size:24px;
    cursor:pointer;
    box-sizing: border-box;
    border: 6px outset #1C6EA4;    
    color:white;
    ${({ show }) => show && Open};
    ${({ show, isBomb }) => show && isBomb && Bomb};
    ${({ show, empty }) => show && empty && Empty};
    ${({ dash }) => dash && Dash};
`
// const Result = styled.div`
//     font-size: 24px;
//     padding: 10px;
// `
const Minesweeper = () => {
    let width = 10;
    let bombCount = 20;

    const [squares, setSquares] = useState([])
    const [gameOver, setGameOver] = useState(false)
    const startGame = () => {
        setGameOver(false)
        const bombsArray = Array(bombCount).fill({ value: '*' });
        const emptyArray = Array((width * width) - bombCount).fill({ value: '' });
        const gamesArray = [...emptyArray, ...bombsArray];
        const shuffledArray = gamesArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < shuffledArray.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width - 1);
            // layout to check
            // 7 8 9
            // 4 _ 6
            // 1 2 3
            if (!shuffledArray[i].value) {
                if (i > 0 && !isLeftEdge && shuffledArray[i - 1].value === '*') total++   //bomb at left (4)
                if (i > 11 && !isLeftEdge && shuffledArray[i - 1 - width].value === '*') total++ //bomb at top left(7)                
                if (i > 9 && shuffledArray[i - width].value === '*') total++ //bomb at top (8)
                if (i > 9 && !isRightEdge && shuffledArray[i + 1 - width].value === '*') total++  //bomb at top right (9)
                if (i < 99 && !isRightEdge && shuffledArray[i + 1].value === '*') total++ //bomb at right(6)                
                if (i < 88 && !isRightEdge && shuffledArray[i + 1 + width].value === '*') total++ //bomb at right bottom(3)
                if (i < 89 && shuffledArray[i + width].value === '*') total++ //bomb at bottom(2)
                if (i < 90 && !isLeftEdge && shuffledArray[i - 1 + width].value === '*') total++ //bomb at left bottom(1)                
                shuffledArray[i] = { value: total || '' };
            }
        }
        setSquares(shuffledArray)
    }
    useEffect(startGame, [])
    const clickHandler = (index) => {
        if (gameOver || squares[index].show || squares[index].flag) return
        if (squares[index].value === '*') {
            let newSquares = [...squares]
            newSquares[index] = { value: '*', dash: true };
            setSquares(newSquares)
            setGameOver(true)
        } else {
            let newSquares = [...squares]
            newSquares[index].show = true;
            setSquares(newSquares)
            if (newSquares[index].value) {
                return
            }
            checkSquares(index)
        }
    }
    const isNotABomb = (cell) => cell.value !== '*'
    const checkSquares = (index) => {
        const isLeftEdge = (index % width === 0);
        const isRightEdge = (index % width === width - 1);
        console.error('initialized again')
        let timer = setTimeout(() => {
            if (index > 0 && !isLeftEdge) { //toward left
                if (isNotABomb(squares[index - 1])) {
                    clickHandler(index - 1)
                }

            }
            if (index > 9 && !isRightEdge) { //toward upper right
                if (isNotABomb(squares[index + 1 - width])) {
                    clickHandler(index + 1 - width)
                }

            }
            if (index > 10) { //toward up
                if (isNotABomb(squares[index - width])) {
                    clickHandler(index - width)
                }

            }
            if (index > 11 && !isLeftEdge) {  //toward upper left
                if (isNotABomb(squares[index - 1 - width])) {
                    clickHandler(index - 1 - width)
                }

            }
            if (index < 98 && !isRightEdge) { //toward right
                if (isNotABomb(squares[index + 1])) {
                    clickHandler(index + 1)
                }

            }
            if (index < 90 && !isLeftEdge) { //toward lower left
                if (isNotABomb(squares[index - 1 + width])) {
                    clickHandler(index - 1 + width)
                }

            }
            if (index < 88 && !isRightEdge) {
                if (isNotABomb(squares[index + 1 + width])) {
                    clickHandler(index + 1 + width)
                }

            }
            if (index < 89) {
                if (isNotABomb(squares[index + width])) {
                    clickHandler(index + width)
                }

            }
        }, 10)
    }
    useEffect(() => {
        if (gameOver) {
            let newSquares = [...squares].map(e => ({ ...e, show: true }))
            console.error(newSquares)
            setSquares(newSquares)
        }
    }, [gameOver])
    return (
        <div>
            <Grid>
                {squares.map(({ value, show, dash }, i) => <Block key={i}
                    isBomb={value === '*'}
                    dash={dash}
                    show={show}
                    empty={!value}
                    onClick={() => clickHandler(i)}>{show ? value : ''}</Block>)}
            </Grid>
            <Button onClick={startGame}>(RE)START</Button>
            {gameOver ? <Result>GAME OVER!!!</Result> : ''}
        </div>
    )
}

export default Minesweeper
