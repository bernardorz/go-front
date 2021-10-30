import styled, { css, keyframes } from 'styled-components';
import { shade } from 'polished';
import signInBackground from '../../assets/SignBackground.svg';

interface IContainerProps{
  menu : boolean;
}

export const Container = styled.div<IContainerProps>`
  height: 100vh;

  display: flex;
  align-items: stretch;

  @media(max-width: 1280px) {
   align-items: center;
   justify-content: center;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 100%;
  max-width: 700px;

`;

const appearFromLeft = keyframes`
  from {
    opacity : 0;
    transform : translateX(-50px);
  }
  to{
      opacity: 1;
      transform: translateX(0);
  }
`;

export const AnimationContainer = styled.div`

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  animation: ${appearFromLeft} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;

    }
    
    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover{
        color: ${shade(0.2, '#f4ede8')};
      }
    }
  }
  
  > a {

  color: #ff9000;
  display: flex;
  align-items: center;
  margin-top: 24px;
  text-decoration: none;
  transition: color 0.2s;

  svg {
    margin-right: 1rem;
  }

  &:hover{
    color: ${shade(0.2, '#ff9000')};
  }

}
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackground}) no-repeat center ;
  background-size : cover;


  @media(max-width: 1280px) {
    display: none;
  }
`;

interface IHamburgerProps {
  active : string;
}
