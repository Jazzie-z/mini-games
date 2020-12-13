import { Grid } from 'components/common'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import StandingImg from 'assets/gif/standingman.gif';
import RunningImg from 'assets/gif/runningman.gif';
import LadderImg from 'assets/images/ladder.png';
const Character = styled.div`
    width: 20px;
    height: 40px;    
    bottom: ${({ bottom }) => bottom}px;
    left: ${({ left }) => left}px;
    position:absolute;    
    overflow:hidden;
    z-index:3;
    img{
        width: 35px;
        position: absolute;
        bottom: 0;
        transform: translateX(-8px) rotateY(${({ flip }) => flip ? 180 : 0}deg);
    }
`
const Ladder = styled.div`
    width: 20px;
    height: 200px;
    box-sizing:border-box;
    position:absolute;  
    bottom:0;
    left: ${({ left }) => left}px;
    z-index:2;
    img{
        height: 100%;
    transform: translateX(-68px);
    }
`
const Floor = styled.div`
    width: ${({ width }) => width}px;
    height: 10px;
    left:${({ left }) => left}px;
    position:absolute;
    bottom: 190px;
    background: grey;
`
const Bullets = styled.div`
    background:red;
    position:absolute;
    left:${({ left }) => left}px;
    bottom:${({ bottom }) => bottom}px;
    height: 3px;
    width: 6px;
`
let gravityTimer = null
let bulletTimer = [];
const Temp = () => {
    const ladderHeight = 200;
    const floorHeight = 200;
    const frameSize = 400;
    const charWidth = 20;
    const [bottom, setBottom] = useState(0);
    const [left, setLeft] = useState(0);
    const [camera, setCamera] = useState(0);
    const [moving, setMoving] = useState(0);
    const [falling, setFalling] = useState(false);
    const [shootDirection, setShootDirection] = useState(10)
    const [bullets, setBullets] = useState([])
    const floors = [
        { left: 0, width: 200 },
        { left: 350, width: 200 },
        { left: 650, width: 800 },
    ]
    const ladders = [160, 380, 520, 650, 1050];
    const moveCamera = (value) => {
        if (camera + value >= 0) {
            setCamera(camera + value)
        }
    }
    const moveCharacter = (value) => {
        setMoving(value)
        setShootDirection(value)
        if (left + value - camera >= 0) {
            if (value > 0 && left + value + charWidth > frameSize) {
                moveCamera(value)
            }
            setLeft(prev => prev + value)
        } else if (camera + value >= 0) {
            console.error('came else')
            moveCamera(value)
            setLeft(prev => prev + value)
        } else {
            console.error(left, camera, value)
        }
    }
    const climbLadder = (value) => {
        setBottom(prev => prev + value)
    }
    const shoot = () => {
        let newBullet = {
            left: left + (shootDirection > 0 ? 15 : 0),
            bottom: bottom + 24,
            direction: shootDirection
        }
        setBullets(prev => [...prev, newBullet]);
    }
    const keyHandler = (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (ladders.includes(left) && bottom < 200)
                    climbLadder(10)
                break;
            case 'ArrowDown':
                if (ladders.includes(left) && bottom > 0)
                    climbLadder(-10)
                break;
            case 'ArrowLeft':
                moveCharacter(-10)
                break;
            case 'ArrowRight':
                moveCharacter(10)
                break;
            case ' ':
                shoot();
                break;
        }
    }
    useEffect(() => {
        if (!falling)
            window.addEventListener('keydown', keyHandler)
        return () => window.removeEventListener('keydown', keyHandler)
    }, [falling, bottom, left, camera, bullets, shootDirection])
    useEffect(() => {
        function keyUpHandler() {
            setMoving(0)
        }
        window.addEventListener('keyup', keyUpHandler)
        return () => window.removeEventListener('keyup', keyUpHandler)
    }, [bottom, left, camera])

    useEffect(() => {
        //gravity
        let isFloorPresent = floors.find(e => e.left <= left && (e.left + e.width) > left && bottom === floorHeight)
        if (bottom && !ladders.includes(left) && !isFloorPresent) {
            gravityTimer = setTimeout(() => {
                setFalling(true)
                setMoving(0)
                setBottom(prev => prev - 5);
            }, 20)
        } else {
            setFalling(false)
        }
        return () => clearTimeout(gravityTimer)
    })
    const moveBullets = () => {
        bulletTimer.push(setTimeout(() => {
            let newBullets = [...bullets];
            newBullets = newBullets.map((e) => ({ ...e, left: e.left + e.direction }));
            console.error(newBullets)
            newBullets = newBullets.filter(e => e.left > camera && e.left < (camera + frameSize))
            console.error(newBullets)
            setBullets(newBullets)
        }, 20))
    }
    useEffect(() => {
        if (bullets.length) {
            moveBullets()
        }
        return () => bulletTimer.forEach(e => clearTimeout(e))
    }, [bullets])
    const isInsideFrame = (start, end) => end > camera && start < (camera + frameSize)
    return (
        <div>
            <Grid border={'black'} color={'#4f5382'}>
                <div id="ladders">
                    {ladders.map(left => isInsideFrame(left, left + 20) ? <Ladder left={left - camera} ><img src={LadderImg} /></Ladder> : '')}
                </div>
                <div id="floors">
                    {floors.map(({ left, width }) => isInsideFrame(left, left + width) ? <Floor left={left - camera} width={width} /> : '')}
                </div>
                <div id="bullets">
                    {bullets.map(({ left, bottom }) => <Bullets left={left - camera} bottom={bottom} />)}
                </div>
                <Character bottom={bottom} left={left - camera} flip={moving < 0}>
                    <img src={moving ? RunningImg : StandingImg} />
                </Character>
            </Grid>
            {camera}
        </div>
    )
}

export default Temp
