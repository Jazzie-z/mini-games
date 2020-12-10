import React, { useEffect, useState } from 'react'
import Image1 from 'assets/images/1.jpg'
import Image2 from 'assets/images/2.jpg'
import Image3 from 'assets/images/3.jpg'
import Image4 from 'assets/images/4.jpg'
import Image5 from 'assets/images/5.jpg'
import Image6 from 'assets/images/6.jpg'
import Image7 from 'assets/images/7.jpg'
import Image8 from 'assets/images/8.jpg'
import styled, { css } from 'styled-components'
import { Button, Grid, Result } from 'components/common'

const Hide = css`
    transform: rotateY(180deg);
`
const Show = css`
    transform: rotateY(0);
`
const Card = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  ${({ hide }) => hide && Hide};
  ${({ show }) => show && Show};
`
const Layer = css`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
`
const Image = styled.img`
  ${Layer};
  left:0;
`
const Fallback = styled.div`
${Layer};
  background-color: #2980b9;
  color: white;
  transform: rotateY(180deg);
`
const Time = styled.div`
text-align:center;
padding: 10px 0;
`
let timer = null
export const MemoryGame = () => {
    const [start, setStart] = useState(false)
    const [imageArray, setImages] = useState(Array(16).fill({}));
    const [hide, setHide] = useState(false);
    const [visibleArray, setVisibleArray] = useState([]);
    const [openPicture, setOpenPicture] = useState([]);
    const [time, setTime] = useState(65);
    const [gameOver, setGameOver] = useState(false);
    const generateRandomImage = () => {
        let randomImage = [{ path: Image1, id: 1 }, { path: Image2, id: 2 }, { path: Image3, id: 3 },
        { path: Image4, id: 4 }, { path: Image5, id: 5 }, { path: Image6, id: 6 },
        { path: Image7, id: 7 }, { path: Image8, id: 8 }];
        randomImage = randomImage.concat(randomImage)
        randomImage = randomImage.sort(() => Math.random() - 0.5);
        setImages(randomImage)
        setTimeout(() => setHide(true), 5000)
    }
    useEffect(() => {
        if (start) {
            setHide(false)
            generateRandomImage()
        } else {
            setHide(true)
            setTime(65)
            setVisibleArray([])
            setOpenPicture([])
            setGameOver(false)
            clearTimeout(timer)
        }
    }, [start])
    useEffect(() => {
        if (start && !gameOver) {
            if (time) {
                timer = setTimeout(() => {
                    setTime(prev => prev - 1)
                }, 1000)
            } else {
                setGameOver('GAME OVER')
            }
        }
    }, [time, gameOver, start])

    const isSameImage = ([index1, index2]) => imageArray[index1].id === imageArray[index2].id
    useEffect(() => {
        if (openPicture.length === 2) {
            if (isSameImage(openPicture)) {
                setVisibleArray(prev => [...prev, imageArray[openPicture[0]].id])
                setOpenPicture([])
            } else {
                setTimeout(() => {
                    setOpenPicture([])
                }, 500)
            }
        } else if (visibleArray.length === 8) {
            setGameOver('SUCCESS')
            clearTimeout(timer)
        }
    }, [openPicture, visibleArray])
    const clickHandler = (index) => {
        if (openPicture.length < 2 && hide && !gameOver && start && !openPicture.includes(index))
            setOpenPicture(prev => [...prev, index])
    }
    const stopGame = () => {
        setStart(prev => !prev)
    }
    return (
        <div>
            <Grid>
                {imageArray.map(({ path, id }, index) => (
                    <Card key={index} hide={hide} onClick={() => clickHandler(index)}
                        show={openPicture.includes(index) || visibleArray.includes(id)}>
                        <Image src={path} />
                        <Fallback />
                    </Card>))}
            </Grid>
            {start ? <Time>Remaining Time : {time}</Time> : ''}
            <Button onClick={stopGame}>{start ? 'STOP' : 'START'}</Button>
            {gameOver ? <Result>{gameOver} !!!<div>Your score : {visibleArray.length}</div></Result> : ''}
        </div>
    )
}