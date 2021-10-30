/* eslint-disable @typescript-eslint/ban-types */
import React, { ChangeEvent, useCallback, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  FiArrowLeft, FiMail, FiUser, FiLock, FiCamera,
} from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationError from '../../utils/getValidationErrors';
import api from '../../services/api';

import logoImg from '../../assets/Logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';

import {
  Container, Content, AvatarInput,
} from './styles';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData{
  name : string;
  email : string;
  old_password : string;
  password : string;
  password_confirmation : string;

}

const Profile : React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const { user, updateUpser } = useAuth();
  const history = useHistory();

  const handleSubmit = useCallback(async (data : ProfileFormData) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: (val : string) => !!val.length,
          then: Yup.string().required('Campo obrigatótio'),
          otherwise: Yup.string(),
        }),
        password_confirmation: Yup.string().when('old_password', {
          is: (val : string) => !!val.length,
          then: Yup.string().required('Campo Obrigatório'),
          otherwise: Yup.string(),
        }).oneOf(
          [Yup.ref('password'), null],
          'Confirmação Incorreta',
        ),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const formData = {
        name: data.name,
        email: data.email,
        ...(data.old_password ? {
          old_password: data.old_password,
          password: data.password,
          password_confirmation: data.password_confirmation,
        } : {}),
      };

      const response = await api.put('/profile', formData);

      updateUpser(response.data);

      addToast({
        type: 'success',
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizada com sucesso',
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
        title: 'Erro ao atualizar seu perfil',
        description: 'Ocorreu um erro ao atualizar seu perfil, tente novamente',
      });
    }
  }, [addToast, history]);

  const handleAvatarChange = useCallback((e : ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData();

      data.append('avatar', e.target.files[0]);

      api.patch('/users/avatar', data).then((response) => {
        updateUpser(response.data);

        addToast({
          type: 'success',
          title: 'Avatar Atualizado!',
        });
      });
    }
  }, [addToast]);

  return (
    <Container>

      <header>
        <div>
          <Link to="/">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>

        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha antiga"
          />

          <Input name="password" icon={FiLock} type="password" placeholder="Senha nova" />
          <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirme sua senha" />

          <Button type="submit"> Confirmar Mudança </Button>

        </Form>

      </Content>

    </Container>
  );
};

export default Profile;
