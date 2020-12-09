import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button, Result } from 'components/common';
const Grid = styled.div`
width: 400px;
display:flex;
flex-wrap:wrap;
background: #253243;
`
const Snake = css`
background:orange;
border-radius:50%;
`
const Apple = css`
background: lime;
border-radius:50%;
`
const Box = styled.div`
width:10px;
height:10px;
${({ isSnake }) => isSnake && Snake};
${({ isApple }) => isApple && Apple};
`
let timer = null
const SnakeGame = () => {
    const [snake, setSnake] = useState([0, 1, 2]);
    const [apple, setApple] = useState('')
    const [direction, setDirection] = useState(1)
    const interval = 100;
    const width = 40
    const [appleConsumed, setAppleConsumed] = useState(0);
    const [gameOver, setGameOver] = useState(false)
    const generateApple = () => {
        const newApple = Math.floor(Math.random() * 99);
        if (snake.includes(newApple)) {
            generateApple()
        } else {
            setApple(newApple)
        }
    }
    const restartGame = () => {
        setSnake([0, 1, 2])
        setDirection(1)
        setAppleConsumed(0)
        setGameOver(false)
        generateApple()
    }
    const stopGame = () => {
        clearTimeout(timer)
        setApple('')
        window.removeEventListener('keydown', keyHandler)
    }
    const isSnakeBody = (value) => snake.includes(value) && snake[snake.length - 2] !== value && console.log(snake[snake.length - 2] !== value);
    const isOutOfScreen = (value, direction) => {
        if (direction == 1) {
            return value % width === 0
        } else if (direction === -1) {
            return (value + 1) % width === 0
        }
        return value >= (width * width) || value < 0
    }
    const moveSnake = () => {
        let newSnakePos = [...snake];
        if (!appleConsumed) {
            newSnakePos.shift();
        } else {
            setAppleConsumed(prev => prev - 1)
        }
        let nextCell = newSnakePos[newSnakePos.length - 1] + direction
        if (isSnakeBody(nextCell) || isOutOfScreen(nextCell, direction)) {
            setGameOver(true)
            return
        } else {
            newSnakePos.push(nextCell)
        }
        if (newSnakePos.includes(apple)) {
            setAppleConsumed(prev => prev + 1)
            generateApple()
        }
        setSnake(newSnakePos)
    }
    useEffect(() => {
        if(gameOver) {
            clearTimeout(timer)
            return
        }
        timer = setTimeout(() => {
            if (gameOver) clearTimeout(timer)
            if (apple !== '') moveSnake()
        }, interval);
        return () => clearTimeout(timer)
    }, [snake, direction, appleConsumed, gameOver])
    const keyHandler = (e) => {
        switch (e.key) {
            case "ArrowRight":
                if (direction !== -1)
                    setDirection(1);
                break;
            case "ArrowLeft":
                if (direction !== 1)
                    setDirection(-1);
                break;
            case "ArrowUp":
                if (direction !== width)
                    setDirection(-width);
                break;
            case "ArrowDown":
                if (direction !== -width)
                    setDirection(width);
                break;
        }
    }
    useEffect(() => {
        if (!gameOver)
            window.addEventListener('keydown', keyHandler)
        return () => window.removeEventListener('keydown', keyHandler)
    }, [direction, gameOver, snake])
    return <div><Grid>
        {[...new Array(width * width)].map((e, i) => <Box
            isSnake={snake.includes(i)}
            isApple={i === apple} ></Box>)}
    </Grid>
        <Button onClick={apple ? stopGame : restartGame}>{apple ? 'STOP' : 'START'}</Button>
        {gameOver ? <Result>GAME OVER!!!
            <div>your score : {snake.length - 3}</div>
        </Result> : ''}
    </div>
}

export default SnakeGame
