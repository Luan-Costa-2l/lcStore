import Image from "next/image";
import { ProfileForm } from "@/components/ProfileForm";

const Profile = async () => {
  
  return (
    <main className="bg-gray-100 min-h-[calc(100vh-120px)] p-5">
      <section className="max-w-default mx-auto">
        <h1 className="font-bold text-2xl mb-5">Meu perfil</h1>
        <div className="bg-white p-5 flex items-center text-sm rounded-lg border-[1px] border-gray-300">

          <ProfileForm />

          <div className="w-full flex justify-center">
            <Image src="/login.jpg" alt="Login image" width={280} height={280} className="rounded-full h-full w-auto max-h-80" priority />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Profile;