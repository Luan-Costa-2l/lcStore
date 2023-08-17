import { SearchArea } from "@/components/SearchArea";
import api from '@/api';
import { Ad } from "@/components/Ad";

const Home = async () => {
  const adData = await api.getAds({});

  return (
    <main className="bg-gray-100 min-h-[calc(100vh-60px)]">
      <SearchArea />
      <div className="px-5 py-6">
        <section className="max-w-default mx-auto">
          <h1 className="font-bold text-2xl pb-5">Anúncios recentes</h1>
          <div className="grid grid-cols-4 gap-10">
            {adData && adData.ads && adData.ads.map(item => (
              <Ad id={item.id} url={item.image} title={item.title} price={item.price} key={item.id} />
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}


export default Home;