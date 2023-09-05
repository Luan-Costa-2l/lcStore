'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { isLogged, doLogout } from "@/helpers/AuthHandler";

export const NavBar = () => {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    setLogged(isLogged());
  }, []);

  const logout = () => {
    doLogout();
    setLogged(false);
  }

  return (
    <nav>
      <ul className='flex items-center text-sm uppercase gap-2'>
        {!logged &&
          <>
            <li>
              <Link href={`/signin`} className='py-2 px-3 hover:text-gray-600 transition-colors'>Entrar</Link>
            </li>
            <li>
              <Link href={`/signup`} className='py-2 px-3 hover:text-gray-600 transition-colors'>Cadastrar</Link>
            </li>
            <li>
              <Link href={`/signin`} className='bg-blue-light py-2 px-3 rounded-lg text-white hover:bg-blue-dark transition-colors'>Postar um anúncio</Link>
            </li>
          </>
        }
        {logged &&
          <>
            <li>
              <Link href={`/profile`} className='py-2 px-3 hover:text-gray-600 transition-colors'>Perfil</Link>
            </li>
            <li>
              <button className="py-2 px-3 hover:text-gray-600 transition-colors uppercase" onClick={logout}>Sair</button>
            </li>
            <li>
              <Link href={`/addad`} className='bg-blue-light py-2 px-3 rounded-lg text-white hover:bg-blue-dark transition-colors'>Postar um anúncio</Link>
            </li>
          </>
        }
      </ul>
    </nav>
  )
}