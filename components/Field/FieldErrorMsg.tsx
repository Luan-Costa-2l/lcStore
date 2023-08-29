import { ReactNode } from "react";

interface FieldErrorMsgProps {
  children: ReactNode;
  message: string;
}
export const FieldErrorMsg = ({ children, message }: FieldErrorMsgProps) => {
  return (
    <div className={`flex-1 ${message ? 'mb-2' : ''}`}>
      {children}
      <span className="block text-red-600 whitespace-nowrap absolute">{message}</span>
    </div>
  )
}