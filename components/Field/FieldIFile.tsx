import { ChangeEvent, ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  alert?: boolean;
}

export const FieldIFile = ({ alert, ...props }: InputProps) => {
  return (
    <input 
      {...props}
      className={`flex-1 w-full p-1 border-[1px] border-gray-300 rounded outline-1 outline-gray-400 ${alert ? 'border-red-500' : ''}`} 
    />
  )
}