'use client'

import { useState } from "react";
import { AdType } from "@/types";
import Link from "next/link";
import { fixPrice } from "@/helpers/Formaters";

interface ProfileAdListProps {
  adList: AdType[];
  openModal: (id: string) => void;
}

export const ProfileAdList = ({ adList, openModal }: ProfileAdListProps) => {
  const [openMenu, setOpenMenu] = useState('');

  const handleOpenMenu = (id: string): void => {
    if (id != openMenu) {
      setOpenMenu(id);
      return;
    }
    setOpenMenu('');
  }

  return (
    <section className="max-w-default mx-auto my-10">
      <h1 className="font-bold text-2xl pb-5">Meus anúncios</h1>
      <div className="grid grid-cols-4 gap-10">
        {adList && adList.map(item => (
          <div key={item.id} className="flex flex-col bg-white p-3 rounded-lg border-[1px] border-gray-300">

            {/* menu */}
            <div className="relative self-end h-7 w-7">
              <div 
                onClick={() => handleOpenMenu(item.id)} 
                className="flex flex-col justify-center items-center gap-[3px] mb-3 text-center cursor-pointer"
              >
                <span className="bg-black w-1 h-1 rounded"></span>
                <span className="bg-black w-1 h-1 rounded"></span>
                <span className="bg-black w-1 h-1 rounded"></span>
              </div>
              {openMenu === item.id &&
              <>
                <span className="block w-0 ml-[3px] border-[16px] border-blue-light border-x-transparent border-t-0"></span>
                <ul className="bg-blue-light text-white py-1 absolute rounded uppercase">
                  <li>
                    <button className="mb-1 px-3 py-1 uppercase hover:bg-blue-dark" onClick={() => openModal(item.id)}>Editar</button>
                  </li>
                  <li>
                    <Link href={`/ads/${item.id}`} className="block px-3 py-1 hover:bg-blue-dark">Ver</Link>
                  </li>
                </ul>
              </>
              }
            </div>

            {/* adinfo */}
            <img src={item.image} alt={item.title} className="rounded-t-lg border-[1px] border-gray-300" />
            <div>
              <p className="py-1">{item.title}</p>
              <div className="font-bold text-xl">{fixPrice(item.price)}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}