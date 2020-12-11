import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Grid } from 'components/common'

const Cell = styled.div`
    width: 20px;
    height: 20px;
    box-sizing:border-box;
    border: 1px solid rgba(225,225,225,0.05);
    ${({ colors }) => colors && css`
        background: linear-gradient(45deg, ${colors[0]} 0%, ${colors[1]} 100%);
        border:none;
    `}
`
const randomColors = [
    ['#99daff', '#008080',],
    ['#059900', '#00ff00',],
    ['#ff0000', '#8a0000',],
    ['#f8ff26', '#baba00',],
    ['#b8b8b8', '#000000',],
    ['#800080', '#f700ff',],
    ['#ffffff', '#008080',],
    ['#612f03', '#ff8c00',]
]


const getTerminoes = (width) => {
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]
    return [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]
}
let blockTimer = null
const Tetris = () => {
    const width = 20;
    const displayWidth = 4;
    const [cells, setCells] = useState([...Array(400)].map(() => ({})))
    const [block, setBlock] = useState({ index: [] })
    const [nextTermino, setNextTermino] = useState({index:[]})
    const [position, setPosition] = useState(0);
    const [rotation, setRotation] = useState(0);
    const [tetrominoType, setTetrominoType] = useState('')
    const createNewBlock = (size) => {
        let tetrominoes = getTerminoes(size)
        let randomIndex = Math.floor(Math.random() * (tetrominoes.length - 1))
        if (size === width) setTetrominoType(randomIndex)
        return tetrominoes[randomIndex][rotation]
    }
    const generateNewBlock = () => {
        // let blocks = [
        //     [10, 11, 30, 50],
        //     [36, 37, 38, 18],
        //     [30, 10, 11, 12],// |__
        //     [36, 37, 38, 18],// __|
        //     [1, 2, 3, 23],// --|
        //     [4, 5, 24, 25],// []
        //     [2, 3, 4, 5, 6],//  ---      
        //     [9, 10, 11, 29],//  |--
        // ];
        if (nextTermino.index.length) {
            console.error(nextTermino)
            setBlock({ ...nextTermino, index: createNewBlock(width).map(e => position + e) })
            setNextTermino({ index: createNewBlock(displayWidth), colors: getRandomColor() })
        } else {            
            console.error(getRandomColor())
            setBlock({ index: createNewBlock(width).map(e => position + e), colors: getRandomColor() })
            setNextTermino({ index: createNewBlock(displayWidth), colors: getRandomColor() })
        }
    }
    // useEffect(() => {
    //     setTimeout(()=>{
    //         let newCells = [...cells]

    //         for(let i=380;i<400;i++)
    //             newCells[i]={colors:['red','red']}
    //         setCells(newCells)
    //     },1000)
    // }, [])
    const isBottomReached = () => {
        let blockIndex = block.index;
        let lastRow = (width * width) - width;
        let isLastRowReached = blockIndex.find(e => e >= lastRow);
        let isBlockPresent = block.index.some(i => cells[i + width] && cells[i + width].colors);
        return isLastRowReached || isBlockPresent
    }
    useEffect(() => {
        if (block.index.length) {
            blockTimer = setTimeout(() => {
                let newBlock = { ...block };
                newBlock.index = newBlock.index.map(e => e + width)
                setPosition(prev => prev + width)
                setBlock(newBlock)
            }, 500)
            if (isBottomReached()) {
                clearTimeout(blockTimer)                
                setPosition(Math.floor(Math.random() * (width - 2)))
                setTimeout(()=>{
                    let newCells = [...cells];
                    block.index.forEach(i => newCells[i] = { colors: block.colors })                    
                    setBlock({ index: [] })
                    setCells(newCells)
                } ,100)               
            }
        } else {
            generateNewBlock()
        }
        return () => clearTimeout(blockTimer)
    }, [block])
    const getRandomColor = () => randomColors[Math.floor(Math.random() * (randomColors.length - 1))]
    const moveRight = () => {
        const rightEdge = block.index.find((e) => e % width === width - 1);
        const cellPresent = block.index.some(e => cells[e + 1].colors)
        if (!rightEdge && block.index && !cellPresent) {
            let newBlock = { ...block }
            newBlock.index = newBlock.index.map(e => e + 1)
            setBlock(newBlock)
            setPosition(prev => prev + 1)
        }
    }
    const moveLeft = () => {
        const leftEdge = block.index.find((e) => e % width === 0);
        const cellPresent = block.index.some(e => cells[e - 1].colors)
        if (!leftEdge && block.index && !cellPresent) {
            let newBlock = { ...block }
            newBlock.index = newBlock.index.map(e => e - 1)
            setBlock(newBlock)
            setPosition(prev => prev - 1)
        }
    }
    const rotate = () => {
        let currentRotation = rotation + 1
        if (currentRotation === block.index.length) {
          currentRotation = 0
        }
        setRotation(currentRotation)
        setBlock(prev => ({ ...prev, index: getTerminoes(width)[tetrominoType][currentRotation].map(e => e + position) }))
    }
    const keyHandler = (e) => {
        switch (e.key) {
            case 'ArrowLeft':moveLeft()
                break;
            case 'ArrowRight': moveRight()
                break;
            case 'ArrowUp': rotate()
                break;
        }
    }
    useEffect(() => {
        window.addEventListener('keydown', keyHandler)
        return () => window.removeEventListener('keydown', keyHandler)
    },[block])
    useEffect(() => {
        let validRows = []
        for (let i = 0; i < width; i++) {
            let isComplete = true
            for (let j = 1; j < width; j++) {
                if (!cells[(i * width) + j].colors) {
                    isComplete = false
                    break
                }
            }
            if (isComplete) validRows.push(i+1)
        }
        console.error(validRows)
        if (validRows.length) {
            let newCells = [...cells]
            validRows.forEach(index => {
                for (let j = (index * width) - 1; j >= 0; j--) {
                    newCells[j] = newCells[j - width] || {};
                }
            })
            setTimeout(() => {
                setCells(newCells)
            }, 1000)
        }
    }, [cells])
    return (
        <Grid color={'#0f1d38'}>
            {cells.map(({ colors }, i) => (<Cell
                key={i}
                colors={colors || block.index.includes(i) && block.colors}></Cell>))}
        </Grid>
    )
}

export default Tetris
