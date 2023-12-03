import { css, Global, ThemeProvider } from '@emotion/react';
import ReactDOM from 'react-dom/client';
import App from "./app";
import { Theme } from './style-variables';

const GlobalStyles = css`

  * {
    font-family: 'Noto Sans', sans-serif;
    font-family: 'Open Sans', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
  }

  &.hover-active {
    &:hover {
      background-color: ${Theme.background.secondary};
      opacity: 0.8;
    }

    &:active {
      background-color: ${Theme.background.tertiary};
      opacity: 0.8;
    }
  }

  ::-webkit-scrollbar {
    width: 14px;
    position: absolute;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 999px;
    box-shadow: inset 0 0 14px 14px ${Theme.scrollBar};
    border: solid 4px transparent;
    border-right-width: 5px;
    border-left-width: 5px;
    
    @supports not (overflow-y: overlay) {
        border-color: ${Theme.background.secondary};
    }
    @supports not (overflow-x: overlay) {
        border-color: ${Theme.background.secondary};
    }
  }

  html, body, div#root {
    height: 100%;
  }

  body {
    font-size: 14px;
    
    &.scroll-disabled {
      overflow-y: hidden;
    }
    
    &.dark-mode {
      color: ${Theme.inverse.content.primary};
      background-color: ${Theme.content.primary};

      *.white-text {
        color: ${Theme.inverse.content.primary};
      } 
      *.primary-background {
        background-color: ${Theme.content.primary};
      } 
      *.secondary-background {
        background-color: ${Theme.content.primary};
      } 
      *.tertiary-background {
        background-color: ${Theme.content.secondary};
      } 
    }
    &:not(.dark-mode ){
      color: ${Theme.content.primary};
      background-color: ${Theme.background.secondary};

      *.white-text {
        color: ${Theme.content.primary};
      } 
      *.primary-background {
        background-color: ${Theme.background.primary};
      } 
      *.secondary-background {
        background-color: ${Theme.background.secondary};
      } 
      *.tertiary-background {
        background-color: ${Theme.background.tertiary};
      } 
    }
  }

  .hide-on-desktop {
    @media screen and (min-width: ${Theme.breakPoints.mobile}px) {
        display: none !important;
  
        >*{
            display: none !important;
        }
    }
  }
  
  .hide-on-mobile {
      @media screen and (max-width: ${Theme.breakPoints.mobile}px) {
          display: none !important;

          >*{
              display: none !important;
          }
      }
  }
`;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <ThemeProvider theme={Theme}>
      <Global styles={GlobalStyles} />
      <App />
    </ThemeProvider>,
)
