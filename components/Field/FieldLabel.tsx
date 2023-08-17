interface FieldLabelProps {
  title: string;
}

export const FieldLabel = ({ title }: FieldLabelProps) => {
  return (
    <label htmlFor="name" className="font-bold min-w-[150px] text-right">
      {title}
    </label>
  )
}