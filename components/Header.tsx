import Link from 'next/link';
import { NavBar } from './Navbar';

export const Header = () => {
    return (
        <header>
            <div className='flex justify-between items-center max-w-[1200px] min-h-[60px] mx-auto border-b-[1px] border-gray-500'>
                <div className='uppercase text-2xl font-bold'>
                    <Link href={`/`}>lcstore</Link>
                </div>
                <NavBar />
            </div>
        </header>
    )
}