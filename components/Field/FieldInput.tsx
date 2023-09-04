import { ChangeEvent, ComponentProps } from 'react';

interface InputProps extends ComponentProps<'input'> {
  setValue: (newValue: string) => void;
  alert?: boolean;
  clearErros: () => void;
}

export const FieldInput = ({ setValue, alert, clearErros, ...props }: InputProps) => {
  const setChanges = (e: ChangeEvent<HTMLInputElement>) => {
    if (alert) {
      clearErros();
    }
    setValue(e.target.value);
  }

  return (
    <input 
      {...props}
      onChange={setChanges}
      className={`flex-1 w-full p-1 border-[1px] border-gray-300 rounded outline-1 outline-gray-400 ${alert ? 'border-red-500' : ''}`} 
    />
  )
}