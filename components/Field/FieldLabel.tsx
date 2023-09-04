import { ComponentProps } from "react";

interface FieldLabelProps extends ComponentProps<'label'> {
  title: string;
}

export const FieldLabel = ({ title, ...props }: FieldLabelProps) => {
  return (
    <label {...props} className="font-bold min-w-[150px] text-right">
      {title}
    </label>
  )
}