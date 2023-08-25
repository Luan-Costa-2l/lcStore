interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  setValue: (newValue: string) => void;
}

export const FieldInput = ({ setValue, ...props }: InputProps) => {
  return (
    <input 
      {...props}
      onChange={e => setValue(e.target.value)}
      className="flex-1 w-full p-1 border-[1px] border-gray-300 rounded outline-1 outline-gray-400" 
    />
  )
}