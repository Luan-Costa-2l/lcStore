'use client'

import { useState, useEffect, FormEventHandler } from "react";
import Cookies from "js-cookie";
import { z } from "zod";
import api from "@/api";
import { State } from "@/types";
import Field from "./Field";

type ErrorFieldOptions = '' | 'name' | 'state' | 'email' | 'password' | 'confirmPassword';

export const SignupForm = () => {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorField, setErrorField] = useState<ErrorFieldOptions>('');
  const [errorMessage, setErrorMessage] = useState('');

  const [stateList, setStateList] = useState<State[]>([]);
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStates = async () => {
      const res = await api.getStates();
      setStateList(res);
    }
    fetchStates();
  }, []);

  const SignUp = z.object({
    name: z.string().nonempty('Este campo não pode estar vazio').min(2, 'Nome precisa ter pelo menos 2 caracters'),
    state: z.string().nonempty('Este campo não pode estar vazio'),
    email: z.string().nonempty('Este campo não pode estar vazio').email('Formato de E-mail inválido'),
    password: z.string().nonempty('Este campo não pode estar vazio').min(4, 'Senha precisa ter pelo menos 4 caracteres'),
    confirmPassword: z.string().nonempty('Este campo não pode estar vazio')
  });

  const clearErros = () => {
    setErrorField('');
    setErrorMessage('');
  }

  const handleSignup: FormEventHandler = async (e) => {
    e.preventDefault();
    clearErros();

    const result = SignUp.safeParse({
      name,
      state,
      email,
      password,
      confirmPassword
    });

    if (!result.success) {
      const data: { message: string, path: string[] } = JSON.parse(result.error.message)[0];
      const errorPath = data.path[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(data.message);
      return;
    }

    if (password !== confirmPassword) {
      setErrorField('confirmPassword');
      setErrorMessage('As senhas não batem');
      return;
    }

    const body = {
      name,
      email,
      state,
      password
    }
    setLoading(true);
    const response = await api.signup(body);
    setLoading(false);

    if ('error' in response) {
      const errorPath = Object.keys(response.error)[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(response.error[errorPath].msg);
      return;
    }

    Cookies.set('token', response.token);
  }

  const verifyAlert = (fieldName: string): boolean => {
    return fieldName === errorField;
  }

  return (
    <form method="POST" className="w-full" onSubmit={handleSignup}>
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
        <Field.Label title="Confirmar senha:" />
        <Field.ErrorMessage  message={errorField == 'confirmPassword' ? errorMessage : ''}>
          <Field.Input type="password" name="confirmPassword" required={true} value={confirmPassword} setValue={setConfirmPassword} alert={verifyAlert('confirmPassword')} clearErros={clearErros} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="" />
        <Field.Button type="submit" title={loading ? 'Cadastrando...' : 'Cadastrar'} />
      </Field.FieldRoot>
    </form>
  )
}