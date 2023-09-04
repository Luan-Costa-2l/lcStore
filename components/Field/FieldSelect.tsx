import { ChangeEvent, ComponentProps } from 'react';

interface SelectProps extends ComponentProps<'select'> {
  data: { _id: string, name: string }[];
  name: string;
  alert?: boolean;
  setValue: (newValue: string) => void;
  clearErros: () => void;
}

export const FieldSelect = ({ data, setValue, alert, clearErros, name, ...props }: SelectProps) => {
  const setChanges = (e: ChangeEvent<HTMLSelectElement>) => {
    if (alert) {
      clearErros();
    }
    setValue(e.target.value);
  }
  
  return (
      <select 
        {...props}
        id={name}
        onChange={setChanges} 
        className="border-[1px] border-gray-300 py-1 px-2 rounded outline-1 outline-gray-400"
      >
        <option value="" disabled>Selecionar</option>
        {data.length && data.map(item => (
          <option value={item._id} key={item._id}>{item.name}</option>
        ))}
      </select>
  )
}