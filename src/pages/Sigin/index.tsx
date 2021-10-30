/* eslint-disable react/button-has-type */
import React, {
  useRef, useState, useCallback, useEffect,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import logoImg from '../../assets/Logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container, Content, Background, AnimationContainer,
} from './styles';
import getValidationError from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
// menu ? 'active' : ''
interface SignInFormData{
  email : string;
  password : string;
}

const SignIn : React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const [activeLi, setActiveLi] = useState(false);
  const [menu, setMenu] = useState(false);

  const { signIn, user } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data : SignInFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        password: Yup.string().required('Senha obrigatoria'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await signIn({
        email: data.email,
        password: data.password,
      });

      history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationError(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticação',
        description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
      });
    }
  }, [signIn, addToast, history]);

  return (
    <Container menu={menu}>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu login</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input name="password" icon={FiLock} type="password" placeholder="Senha" />

            <Button type="submit"> Entrar </Button>

            <Link to="/forgot-password">Esqueci minha senha </Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>

        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
