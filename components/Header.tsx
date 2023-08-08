import Link from 'next/link';

export const Header = () => {
    return (
        <header>
            <div className='flex justify-between items-center max-w-[1200px] min-h-[60px] mx-auto border-b-[1px] border-gray-500'>
                <div className='uppercase text-2xl font-bold'>
                    <Link href={`/`}>lcstore</Link>
                </div>
                <nav>
                    <ul className='flex text-sm  uppercase gap-2'>
                        <li>
                            <Link href={`/signin`} className='py-2 px-3 hover:text-gray-600 transition-colors'>Entrar</Link>
                        </li>
                        <li>
                            <Link href={`/signup`} className='py-2 px-3 hover:text-gray-600 transition-colors'>Cadastrar</Link>
                        </li>
                        <li>
                            <Link href={`/addad`} className='bg-blue-light py-2 px-3 rounded-lg text-white hover:bg-blue-dark transition-colors'>Postar um anúncio</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}