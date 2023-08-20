import Image from "next/image";
import { SignupForm } from "@/components/SignupForm";

const Signup = async () => {
  return (
    <main className="bg-gray-100 min-h-[calc(100vh-120px)] p-5">
      <section className="max-w-default mx-auto">
        <h1 className="font-bold text-2xl mb-5">Realizar cadastro</h1>
        <div className="bg-white p-5 flex text-sm rounded-lg border-[1px] border-gray-300">

          <SignupForm />

          <div className="w-full flex justify-center">
            <Image src="/login.jpg" alt="Login image" width={280} height={280} className="rounded-full" priority />
          </div>
        </div>
      </section>
    </main>
  )
}

export default Signup;