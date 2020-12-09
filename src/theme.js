import { createGlobalStyle } from "styled-components"

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: sans-serif;
  }
`
export const theme = {
    colors: {
        primary: '#4f90ff',
        primaryWithOpacity: '#4f90ff8a',
        secondary: '#e1e1e1',
        grey: '#4e4e4e',
        black: 'black',
        white: 'white'
    }
}