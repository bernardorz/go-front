/* eslint-disable react/button-has-type */
import React, {
  useRef, useState, useCallback, useEffect,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
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
import api from '../../services/api';
// menu ? 'active' : ''
interface ResetPasswordFormData{
  password : string;
  password_confirmation : string;
}

const ResetPassword : React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const location = useLocation();
  const [menu, setMenu] = useState(false);

  const { signIn, user } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data : ResetPasswordFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        password: Yup.string().required('Senha obrigatoria'),
        password_confirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const { password, password_confirmation } = data;
      const token = location.search.replace('?token=', '');

      if (!token) {
        throw new Error();
      }

      await api.post('/password/reset', {
        password,
        password_confirmation,
        token,
      });

      addToast({
        type: 'success',
        title: 'Senha alterada com sucesso',
        description: 'Você ja pode efetuar login com sua nova senha',
      });

      history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationError(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro ao resetar senha',
        description: 'Ocorreu um erro ao resetar sua senha, tente novamente',
      });
    }
  }, [addToast, history, location.search]);

  return (
    <Container menu={menu}>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />

            <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmação da senha" />

            <Button type="submit"> Alterar senha </Button>
          </Form>

        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ResetPassword;
