import { SearchArea } from "@/components/SearchArea";

export default function Home() {
  return (
    <main>
      <SearchArea />
      <div className="max-w-default mx-auto py-6">
        <h1 className="font-bold text-2xl">Anúncios recentes</h1>
      </div>
    </main>
  )
}
