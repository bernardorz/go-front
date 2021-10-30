/* eslint-disable react/button-has-type */
import React, {
  useRef, useState, useCallback, useEffect,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
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
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

interface ForgotPasswordFormData{
  email : string;
}

const ForgotPassword : React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [menu, setMenu] = useState(false);

  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data : ForgotPasswordFormData) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      await api.post('/password/forgot', {
        email: data.email,
      });

      addToast({
        type: 'success',
        title: 'E-mail de recuperação de senha enviado',
        description: 'Enviamos um -email para confirmar a recuperação de senha, cheque sua caixa de entrada',
      });

      // history.push('/dashboard');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationError(err);
        formRef.current?.setErrors(errors);
        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na recuperação de senha',
        description: 'Ocorreu um erro ao fazer tentar realizar a recuperação de senha, tente novamente',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  return (
    <Container menu={menu}>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit"> Recuperar </Button>

          </Form>

          <Link to="/">
            <FiLogIn />
            Voltar ao login
          </Link>

        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPassword;
