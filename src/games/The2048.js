import { Button, Grid } from "components/common";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CustomGrid = styled(Grid)`
  padding: 10px;
  box-sizing: border-box;
  border-radius: 5px;
`;
const Block = styled.div`
  borde-radius: 5px;
  width: 85px;
  height: 85px;
  margin: 5px;
  box-sizing: border-box;
  background: ${({ color }) => color || "#cfc1b2"};
  border-radius: 5px;
  color: ${({ value }) => (value <= 4 ? "#776e65" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  font-weight: bold;
`;
const colorMap = {
  2: "#f0e4d9",
  4: "#efe0c5",
  8: "#fcae6f",
  16: "#ff9057",
  32: "#ff7456",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22d",
  4096: "#6ecc13",
  8192: "#64c00b",
  16384: "#61b70b",
  32768: "#54a802",
  65536: "#4a9400",
  131072: "#5989f7",
};
const The2048 = () => {
  const width = 4;
  const [squares, setSquares] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const findEmptySquare = (array) => {
    if (array.filter((e) => !e).length) {
      let index = Math.floor(Math.random() * array.length);
      if (!array[index]) {
        return index;
      } else {
        return findEmptySquare(array);
      }
    } else {
      return -1;
    }
  };
  const generateNewNumber = (array) => {
    let newIndex = findEmptySquare(array);
    if (newIndex !== -1) {
      let newNumbers = [2, 4];
      newNumbers.sort(() => Math.random() - 0.5);
      let newSquares = [...array];
      newSquares[newIndex] = newNumbers[0];
      setSquares(newSquares);
    } else {
      console.error("no index present", array, newIndex);
    }
  };
  const resetGame = () => {
    generateNewNumber([...Array(width * width)].fill(0));
  };
  useState(() => {
    resetGame();
  }, []);
  const combineRow = (row) => {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        row[i] = row[i] + row[i + 1];
        row[i + 1] = 0;
      }
    }
    row = row.filter((e) => e);
    return row;
  };
  const addAndMoveHorizontally = (direction) => {
    let newSquares = [];
    for (let i = 0; i < width * width; i += width) {
      let totalOne = squares[i];
      let totalTwo = squares[i + 1];
      let totalThree = squares[i + 2];
      let totalFour = squares[i + 3];
      let row = [totalOne, totalTwo, totalThree, totalFour];
      let filteredRow = row.filter((e) => e);
      filteredRow = combineRow(filteredRow);
      let missing = width - filteredRow.length;
      let zeros = Array(missing).fill(0);
      let newRow = [...zeros, ...filteredRow];
      if (direction < 0) newRow = [...filteredRow, ...zeros];
      newSquares = [...newSquares, ...newRow];
    }
    generateNewNumber(newSquares);
  };
  const addAndMoveVertically = (direction) => {
    let newSquares = [];
    for (let i = 0; i < width; i += 1) {
      let totalOne = squares[i];
      let totalTwo = squares[i + 1 * width];
      let totalThree = squares[i + 2 * width];
      let totalFour = squares[i + 3 * width];
      let col = [totalOne, totalTwo, totalThree, totalFour];
      let filteredCol = col.filter((e) => e);
      filteredCol = combineRow(filteredCol);
      let missing = width - filteredCol.length;
      let zeros = Array(missing).fill(0);
      let newCol = [...zeros, ...filteredCol];
      if (direction < 0) newCol = [...filteredCol, ...zeros];
      newSquares[i] = newCol[0];
      newSquares[i + width] = newCol[1];
      newSquares[i + 2 * width] = newCol[2];
      newSquares[i + 3 * width] = newCol[3];
    }
    generateNewNumber(newSquares);
  };

  const keyHandler = (e) => {
    switch (e.key) {
      case "ArrowRight":
        addAndMoveHorizontally(1);
        break;
      case "ArrowLeft":
        addAndMoveHorizontally(-1);
        break;
      case "ArrowUp":
        addAndMoveVertically(-1);
        break;
      case "ArrowDown":
        addAndMoveVertically(1);
        break;
    }
  };
  useEffect(() => {
    if (!gameOver) window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [gameOver, squares]);
  return (
    <div>
      <CustomGrid color={"#bdad9e"}>
        {squares.map((value, i) => (
          <Block key={i} color={colorMap[value]} value={value}>
            {value || ""}
          </Block>
        ))}
      </CustomGrid>
      <Button onClick={resetGame}>(Re)start</Button>
    </div>
  );
};

export default The2048;
