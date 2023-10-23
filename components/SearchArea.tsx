import Link from "next/link";
import api from '@/api';


export const SearchArea = async () => {
  const categories = await api.getCategories();
  const states = await api.getStates();

    return (
        <section className="p-5 bg-[#ddd]">
            <form className="max-w-default mx-auto bg-blue-light flex gap-4 py-5 px-3 rounded-lg" action="/ads">
                <select 
                    name="categories" 
                    title="Categories list" 
                    id="" 
                    className="bg-[#eee] text-center border-r-gray-400 border-r-[1px] rounded-lg p-2"
                >
                    <option value="">Todos</option>
                    {categories.length && categories.map((item) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                </select>

                <input 
                    type="text" 
                    name="q" 
                    title="Search field" 
                    id="" 
                    placeholder="BUSCA NA LCSTORE" 
                    className="flex-1 p-2 rounded-lg" 
                />

                {states.length &&
                    <select name="states" title="State list" id="" className="rounded-lg p-2">
                        {states.map((item) => (
                            <option key={item._id} value={item._id}>{item.name}</option>
                        ))}
                    </select>
                }

                <button className="bg-green py-2 px-3 rounded-lg text-white hover:bg-green-dark transition-colors" type="submit">BUSCAR</button>
            </form>

            <ul className="max-w-default mx-auto flex gap-3 mt-5">
                <li>
                    <Link href={`/`} className="p-3 rounded-lg hover:bg-blue-dark hover:text-white transition-colors">Celulares</Link>
                </li>
                <li>
                    <Link href={`/`} className="p-3 rounded-lg hover:bg-blue-dark hover:text-white transition-colors">Carros</Link>
                </li>
                <li>
                    <Link href={`/`} className="p-3 rounded-lg hover:bg-blue-dark hover:text-white transition-colors">Notebooks</Link>
                </li>
                <li>
                    <Link href={`/`} className="p-3 rounded-lg hover:bg-blue-dark hover:text-white transition-colors">Roupas</Link>
                </li>
            </ul>
        </section>
    )
}