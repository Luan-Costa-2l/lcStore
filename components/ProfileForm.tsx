'use client'

import { useState, useEffect, FormEventHandler } from "react";
import { z } from "zod";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import api from "@/api";
import { AdType, State } from "@/types";
import Field from "./Field";

type ErrorFieldOptions = '' | 'name' | 'state' | 'email' | 'password' | 'newPassword' | 'confirmNewPassword';

export const ProfileForm = () => {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [errorField, setErrorField] = useState<ErrorFieldOptions>('');
  const [errorMessage, setErrorMessage] = useState('');

  const [stateList, setStateList] = useState<State[]>([]);
  const [ads, setAds] = useState<AdType[]>([]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      redirect('/signin');
    }
    const fetchUserInfo = async () => {
      const [userData, states] = await Promise.all([api.getUserInfo(token), api.getStates()]);
      if ('error' in userData) {
        alert('Ocorreu um erro, tente novamente mais tarde.');
        return;
      }
      const { name, email, state, ads, adsTotal } = userData.userInfo;
      setName(name);
      setEmail(email);
      setState(state._id);
      setAds(ads);
      setStateList(states)
    }
    fetchUserInfo();
  }, []);

  const UserInfo = z.object({
    name: z.string().nonempty('Este campo não pode estar vazio').min(2, 'Nome precisa ter pelo menos 2 caracters'),
    state: z.string().nonempty('Este campo não pode estar vazio'),
    email: z.string().nonempty('Este campo não pode estar vazio').email('Formato de E-mail inválido'),
    password: z.string().nonempty('Este campo não pode estar vazio').min(4, 'Senha precisa ter pelo menos 4 caracteres'),
    newPassword: z.string().nonempty('Este campo não pode estar vazio').min(4, 'Senha precisa ter pelo menos 4 caracteres').optional(),
    confirmNewPassword: z.string().nonempty('Este campo não pode estar vazio').optional()
  });

  const clearErros = () => {
    setErrorField('');
    setErrorMessage('');
  }

  const handleSignup: FormEventHandler = async (e) => {
    e.preventDefault();
    clearErros();

    let formData: { name: string, state: string, email: string, password: string, newPassword?: string, confirmNewPassword?: string } = {
      name,
      state,
      email,
      password
    };

    if (newPassword || confirmNewPassword) {
      formData.newPassword = newPassword;
      formData.confirmNewPassword = confirmNewPassword;
    }

    const result = UserInfo.safeParse(formData);

    if (!result.success) {
      const data: { message: string, path: string[] } = JSON.parse(result.error.message)[0];
      const errorPath = data.path[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(data.message);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorField('confirmNewPassword');
      setErrorMessage('As novas senhas não batem');
      return;
    }

    let body: { name: string, state: string, email: string, password: string, newPassword?: string } = {
      name,
      email,
      state,
      password
    }

    if (newPassword) body.newPassword = newPassword;

    setLoading(true);
    const response = await api.updateUserInfo(body);
    setLoading(false);
    console.log(response)

    if ('error' in response) {
      const errorPath = Object.keys(response.error)[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(response.error[errorPath].msg);
      return;
    }
  }

  const verifyAlert = (fieldName: string): boolean => {
    return fieldName === errorField;
  }

  return (
    <form method="PUT" className="w-full" onSubmit={handleSignup}>
      <Field.FieldRoot>
        <Field.Label title="Nome:" />
        <Field.ErrorMessage message={errorField == 'name' ? errorMessage : ''} >
          <Field.Input name="name" required={true} value={name} setValue={setName} alert={verifyAlert('name')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Estado:" />
        <Field.ErrorMessage message={errorField == 'state' ? errorMessage : ''}>
          <Field.Select name="state" value={state} setValue={setState} data={stateList} alert={verifyAlert('email')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="E-mail:" />
        <Field.ErrorMessage message={errorField == 'email' ? errorMessage : ''}>
          <Field.Input type="email" name="email" required={true} value={email} setValue={setEmail} alert={verifyAlert('email')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Senha:" />
        <Field.ErrorMessage message={errorField == 'password' ? errorMessage : ''}>
          <Field.Input type="password" name="password" required={true} value={password} setValue={setPassword} alert={verifyAlert('password')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Nova senha:" />
        <Field.ErrorMessage  message={errorField == 'newPassword' ? errorMessage : ''}>
          <Field.Input type="password" name="newPassword" value={newPassword} setValue={setNewPassword} alert={verifyAlert('newPassword')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Confirmar nova senha:" />
        <Field.ErrorMessage  message={errorField == 'confirmNewPassword' ? errorMessage : ''}>
          <Field.Input type="password" name="confirmPassword" value={confirmNewPassword} setValue={setConfirmNewPassword} alert={verifyAlert('confirmNewPassword')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="" />
        <Field.Button type="submit" title={loading ? 'Salvando...' : 'Salvar alterações'} />
      </Field.FieldRoot>
    </form>
  )
}

