import styled from 'styled-components';
import { shade } from 'polished';
import signUpBackground from '../../assets/SignUpBackground.svg';

export const Container = styled.div`
  > header {
    height: 144px;
    background: #28262e;

    display: flex;
    align-items: center;

    div {
      width: 100%;
      max-width: 1120px;
      margin : 0 auto;

      svg {
        color: #999591;
        width: 24px;
        height: 24px;
      }
    }


  }

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
  margin: -176px auto;

  width: 100%;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;
    display: flex;
    flex-direction: column;

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
  background: url(${signUpBackground}) no-repeat center ;
  background-size : cover;


  @media(max-width: 1280px) {
    display: none;
  }
`;

export const AvatarInput = styled.div`
  margin-bottom: 32px;
  position: relative;
  align-self: center;
  img {
    width: 186px;
    height: 186px;
    border-radius: 50%;
  }
  label {
    position: absolute;
    width: 48px;
    height: 48px;
    background: #ff9000;
    border-radius: 50%;
    right: 0;
    bottom: 0;
    border: 0;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      display: none;
    }
    svg {
      width: 20px;
      height: 20px;
      color: #312e38;
    }
    &:hover {
      background: ${shade(0.2, '#ff9000')};
    }
  }

`;
