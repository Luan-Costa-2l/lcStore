'use client'

import { useState, useEffect, FormEventHandler } from "react";
import Cookies from "js-cookie";
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

  const handleSignup: FormEventHandler = async (e) => {
    e.preventDefault();
    setErrorField('');
    setErrorMessage('');

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

    if (password !== confirmPassword) {
      setErrorField('confirmPassword');
      setErrorMessage('As senhas não batem');
      return;
    }

    Cookies.set('token', response.token);
  }

  return (
    <form method="POST" className="w-full" onSubmit={handleSignup}>
      <Field.FieldRoot>
        <Field.Label title="Nome:" />
        <Field.ErrorMessage message={errorField == 'name' ? errorMessage : ''} >
          <Field.Input name="name" required={true} value={name} setValue={setName} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Estado:" />
        <Field.ErrorMessage message={errorField == 'state' ? errorMessage : ''}>
          <Field.Select name="state" value={state} setValue={setState} data={stateList} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="E-mail:" />
        <Field.ErrorMessage message={errorField == 'email' ? errorMessage : ''}>
          <Field.Input type="email" name="email" required={true} value={email} setValue={setEmail} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Senha:" />
        <Field.ErrorMessage message={errorField == 'password' ? errorMessage : ''}>
          <Field.Input type="password" name="password" required={true} value={password} setValue={setPassword} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Confirmar senha:" />
        <Field.ErrorMessage  message={errorField == 'confirmPassword' ? errorMessage : ''}>
          <Field.Input type="password" name="confirmPassword" required={true} value={confirmPassword} setValue={setConfirmPassword} />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="" />
        <Field.Button type="submit" title={loading ? 'Cadastrando...' : 'Cadastrar'} />
      </Field.FieldRoot>
    </form>
  )
}