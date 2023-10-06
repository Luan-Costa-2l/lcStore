import { ComponentProps } from "react";

interface FieldButttonProps extends ComponentProps<'button'> {
  title: string;
  color?: 'green' | 'blue';
}

export const FieldButton = ({ title, color='blue', ...props }: FieldButttonProps) => {
  const bgColor = color === 'blue' ? 'bg-blue-light' : 'bg-green';
  const bgColorHover = color === 'blue' ? 'bg-blue-dark' : 'bg-green-dark';
  return (
    <button {...props} className={`${bgColor} text-white py-2 px-7 rounded-lg transition-colors hover:${bgColorHover}`}>
      {title}
    </button>
  )
}