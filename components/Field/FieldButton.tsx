interface FieldButttonProps {
  type: 'submit' | 'reset' | 'button' | undefined;
  title: string;
}

export const FieldButton = ({ type=undefined, title }: FieldButttonProps) => {
  return (
    <button type={type} className="bg-blue-light text-white py-2 px-7 rounded-lg transition-colors hover:bg-blue-dark">
      {title}
    </button>
  )
}