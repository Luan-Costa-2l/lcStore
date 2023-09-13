'use client'

import { useState, FormEventHandler } from "react";
import { z } from "zod";
import api from "@/api";
import Field from "./Field";
import Link from "next/link";
import { doLogin } from '@/helpers/AuthHandler';

type ErrorFieldOptions = '' | 'name' | 'state' | 'email' | 'password' | 'confirmPassword';

export const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stayLogged, setStayLogged] = useState(false);

  const [errorField, setErrorField] = useState<ErrorFieldOptions>('');
  const [errorMessage, setErrorMessage] = useState('');

  
  const [loading, setLoading] = useState(false);

  const SignUp = z.object({
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

    setLoading(true);
    const response = await api.signin({ email, password });
    setLoading(false);

    if ('error' in response) {
      const errorPath = Object.keys(response.error)[0];
      setErrorField(errorPath as ErrorFieldOptions);
      setErrorMessage(response.error[errorPath].msg);
      return;
    }
    console.log(response)

    doLogin(stayLogged, response.token);

    window.location.href = '/';
  }

  const verifyAlert = (fieldName: string): boolean => {
    return fieldName === errorField;
  }

  return (
    <form method="POST" className="w-full" onSubmit={handleSignup}>
      <Field.FieldRoot>
        <Field.Label title="E-mail:" />
        <Field.ErrorMessage message={errorField == 'email' ? errorMessage : ''}>
          <Field.Input 
            type="email" 
            name="email" 
            required={true} 
            value={email} 
            setValue={setEmail} 
            alert={verifyAlert('email')} 
            clearErros={clearErros} 
          />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Senha:" />
        <Field.ErrorMessage message={errorField == 'password' ? errorMessage : ''}>
          <Field.Input 
            type="password" 
            name="password" 
            required={true} 
            value={password} 
            setValue={setPassword} 
            alert={verifyAlert('password')} 
            clearErros={clearErros} 
          />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Confirmar senha:" />
        <Field.ErrorMessage  message={errorField == 'confirmPassword' ? errorMessage : ''}>
          <Field.Input 
            type="password" 
            name="confirmPassword" 
            required={true} 
            value={confirmPassword} 
            setValue={setConfirmPassword} 
            alert={verifyAlert('confirmPassword')} 
            clearErros={clearErros} 
          />
        </Field.ErrorMessage>
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Manter login" htmlFor="stay"/>
        <input 
          type="checkbox" 
          name="stay" 
          id="stay" 
          checked={stayLogged} 
          onChange={e => setStayLogged(e.target.checked)} 
          className="cursor-pointer" 
        />
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="" />
        <Field.Button 
          type="submit" 
          title={loading ? 'Carregando...' : 'Entrar'} 
        />
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="" />
        <span>Não tem uma conta? <Link href="/signup" className="text-base text-blue-light transition-colors hover:text-blue-dark mt-3">Cadastrar</Link></span>
      </Field.FieldRoot>
    </form>
  )
}