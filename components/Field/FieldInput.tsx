import { HTMLInputTypeAttribute } from 'react';

interface InputProps {
  type?: HTMLInputTypeAttribute;
  name: string;
  required: boolean;
  value: string;
  setValue: (newValue: string) => void;
}

export const FieldInput = ({ type='text', name, required, value, setValue }: InputProps) => {
  return (
    <input 
    type={type} 
    name={name} 
    id={name} 
    value={value}
    onChange={e => setValue(e.target.value)}
    className="flex-1 p-1 border-[1px] border-gray-300 rounded outline-1 outline-gray-400" 
    required={required}
  />
  )
}