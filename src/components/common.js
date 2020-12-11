import styled from "styled-components";
export const Button = styled.button`
  padding: 5px;
  width: fit-content;
  margin: 10px;
`;
export const Result = styled.div`
  padding: 10px;
  border: 1px solid;
  width: fit-content;
  background: deepskyblue;
  color: white;
`;
export const Title = styled.div`
  padding: 10px;
  text-align: center;
  font-weight: bold;
  text-transform: uppercase;
`;
export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${({ width }) => width || 400}px;
  height: ${({ height }) => height || 400}px;
  background: ${({ color }) => color || "transparent"};
  overflow: hidden;
  position: relative;
  border: ${({ border }) => (border ? `1px solid ${border}` : "none")};
`;
