import Link from "next/link"

export const Footer = () => {
    return (
        <footer className="border-t-[1px] border-gray-500">
            <div className="text-center leading-[60px]">
                Criado por {' '}
                <Link href="https://www.linkedin.com/in/luan-cordeiro-575826254/" target="_blank" className="text-blue-dark hover:text-blue-light transition-colors">Luan Costa.</Link>
            </div>
        </footer>
    )
}