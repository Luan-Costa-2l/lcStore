import { ComponentProps } from 'react';

interface SelectProps extends ComponentProps<'select'> {
  data: { _id: string, name: string }[];
  name: string;
  setValue: (newValue: string) => void;
}

export const FieldSelect = ({ data, setValue, name, ...props }: SelectProps) => {
  return (
      <select 
        {...props}
        id={name}
        onChange={e => setValue(e.target.value)} 
        className="border-[1px] border-gray-300 py-1 px-2 rounded outline-1 outline-gray-400"
      >
        <option value="" disabled>Selecionar</option>
        {data.length && data.map(item => (
          <option value={item._id} key={item._id}>{item.name}</option>
        ))}
      </select>
  )
}