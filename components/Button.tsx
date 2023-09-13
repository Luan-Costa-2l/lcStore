interface ButtonProps {
  title: string;
}

export const Button = ({ title }: ButtonProps) => {
  return (
    <button className="block text-sm w-full py-4 mb-2 bg-green hover:bg-green-dark rounded-lg text-white font-bold">
      {title}
    </button>
  )
}