'use client'

import { useState, useEffect } from "react";
import api from "@/api";
import { State } from "@/types";
import Field from "./Field";

export const SignupForm = () => {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [stateList, setStateList] = useState<State[]>([]);

  useEffect(() => {
    const fetchStates = async () => {
      const res = await api.getStates();
      setStateList(res);
    }
    fetchStates();
  }, []);

  return (
    <form action="" className="w-full">
      <Field.FieldRoot>
        <Field.Label title="Nome:" />
        <Field.Input name="name" required={true} value={name} setValue={setName} />
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Estado:" />
        <Field.Select name="state" value={state} setValue={setState} data={stateList} />
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="E-mail:" />
        <Field.Input type="email" name="email" required={true} value={email} setValue={setEmail} />
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Senha:" />
        <Field.Input type="password" name="password" required={true} value={password} setValue={setPassword} />
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="Confirmar senha:" />
        <Field.Input type="password" name="confirmPassword" required={true} value={confirmPassword} setValue={setConfirmPassword} />
      </Field.FieldRoot>

      <Field.FieldRoot>
        <Field.Label title="" />
        <Field.Button type="submit" title="Cadastrar" />
      </Field.FieldRoot>
    </form>
  )
}