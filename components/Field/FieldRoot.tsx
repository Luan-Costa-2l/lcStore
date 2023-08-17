import { ReactNode } from "react"

interface FieldRootProps {
  children: ReactNode
}

export const FieldRoot = ({ children }: FieldRootProps) => {
  return (
    <div className="mb-4 max-w-[550px] flex items-center gap-4">
      {children}
    </div>
  )
}