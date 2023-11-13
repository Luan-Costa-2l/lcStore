'use client'

import Image from "next/image";
import { ProfileForm } from "@/components/ProfileForm";
import { ProfileAdList } from "@/components/ProfileAdList";
import api from "@/api";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";
import { State, UserType } from "@/types";
import { ProfileAdModal } from "@/components/ProfileAdModal";

const Profile = () => {
  const [userInfo, setUserInfo] = useState<UserType>({ ads: [], adsTotal: 0, email: '', name: '', state: { _id: '', name: '' } });
  const [states, setStates] = useState<State[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [adId, setAdId] = useState('');

  let controller: AbortController;

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      redirect('/signin');
    }
    controller = new AbortController();
    const signal = controller.signal;
    const fetchUserInfo = async () => {
      const [userData, states] = await Promise.all([
        api.getUserInfo({ token, signal }), 
        api.getStates(signal)
      ]);
      if ('error' in userData) {
        alert('Ocorreu um erro, tente novamente mais tarde.');
        return;
      }
      setUserInfo(userData.userInfo);
      setStates(states);
    }
    fetchUserInfo();

    return () => {
      controller.abort();
    }
  }, []);

  const handleOpenModal = (id: string) => {
    setAdId(id);
    setOpenModal(true);
  }

  return (
    <main className="bg-gray-100 min-h-[calc(100vh-120px)] p-5">
      <section className="max-w-default mx-auto">
        <h1 className="font-bold text-2xl mb-5">Meu perfil</h1>
        <div className="bg-white p-5 flex items-center text-sm rounded-lg border-[1px] border-gray-300">

          <ProfileForm userInfo={userInfo} states={states} />

          <div className="w-full flex justify-center">
            <Image src="/login.jpg" alt="Login image" width={280} height={280} className="rounded-full h-full w-auto max-h-80" priority />
          </div>
        </div>
      </section>

      <ProfileAdList adList={userInfo.ads} openModal={handleOpenModal} />

      {openModal &&
        <ProfileAdModal openModal={setOpenModal} id={adId} />
      }
    </main>
  )
}

export default Profile;