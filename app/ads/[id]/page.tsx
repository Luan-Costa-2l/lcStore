import api from "@/api";
import { Button } from "@/components/Button";
import { Slider } from "@/components/Slider";
import { fixPrice } from "@/helpers/Formaters";

const AdInfo = async ({ params }: { params: { id: string } }) => {
  const adData = await api.getAdInfo(params.id);
  return (
    <main className="min-h-[calc(100vh-121px)] p-5 bg-gray-100">
      <section className="max-w-default mx-auto flex">
        <div className="flex flex-1 bg-white p-5 rounded-lg border-[1px] border-gray-300">
          <Slider images={adData.images} />
          <div className="flex-1 flex flex-col pl-5 max-w-[468px]">
            <h1 className="font-bold text-xl">{adData.title}</h1>
            <p className="text-sm">por: <span className="text-gray-600">{adData.userInfo.name}</span></p>
            <div className="font-semibold text-3xl py-3">{fixPrice(adData.price)}</div>
            <p className="flex-1 text-sm whitespace-break-spaces">{adData.description}</p>
            <span className="text-xs">Visualizações: {adData.views}</span>
          </div>
        </div>
        <div className="min-w-[280px] h-fit p-2 ml-5 rounded-lg bg-white border-[1px] border-gray-300">
          <Button title="COMPRAR AGORA" />
          <Button title="ADICIONAR AO CARRINHO" />
          <Button title="FALAR COM O VENDEDOR" />
        </div>
      </section>
    </main>
  )
}

export default AdInfo;