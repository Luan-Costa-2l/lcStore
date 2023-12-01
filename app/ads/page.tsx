'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import api from "@/api";
import { AdType, Category, State } from '@/types';
import { GetAdsParams } from '@/types/apiTypes';
import Link from 'next/link';
import { fixPrice } from '@/helpers/Formaters';
import Image from 'next/image';

let timer: NodeJS.Timeout;

const Ads = () => {
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [state, setState] = useState<string>('');
  const [category, setCategory] = useState<Category | null>(null);

  const [stateList, setStateList] = useState<State[]>([]);
  const [categoryLIst, setCategoryList] = useState<Category[]>();
  const [ads, setAds] = useState<AdType[]>([]);
  const [adsTotal, setAdsTotal] = useState(0);
  
  let controller: AbortController;
  let adsController: AbortController;

  useEffect(() => {
    controller =  new AbortController();
    const signal = controller.signal;
    const fetchData = async () => {
      const [states, categories] = await Promise.all([api.getStates(signal), api.getCategories(signal)]);
      setStateList(states);
      setCategoryList(categories);
    }
    fetchData();

    return () => {
      controller.abort();
    }
  }, []);

  useEffect(() => {
    adsController?.abort();
    adsController = new AbortController();
    const signal = adsController.signal;

    const fetchAdsData = async () => {
      const filters = setFilters({ q: search, state, cat: category?.slug, limit: 9 });
      const adsData = await api.getAds({...filters, signal});
      setAds(adsData.ads);
      setAdsTotal(adsData.total);
    }
    fetchAdsData();

    return () => {
      adsController.abort();
    }
  }, [state, category, search]);

  const setFilters = ({ q, state, cat, limit, offset, sort }: GetAdsParams) => {
    let filters: GetAdsParams = {};
    if (q) filters.q = q;
    if (state) filters.state = state;
    if (cat) filters.cat = cat;
    if (limit) filters.limit = limit;
    if (offset) filters.offset = offset;
    if (sort) filters.sort = sort;

    return filters;
  }

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    clearTimeout(timer);
    const current = searchRef.current;
    if (!current) {
      console.error("Nenhum campo input selecionado.");
      return;
    }
    
    if (e.code.toLocaleLowerCase() === 'enter') {
      setSearch(current.value);
      return;
    }

    timer = setTimeout(() => {
      setSearch(current.value);
    }, 1000);
  }

  return (
    <section className="px-5 py-6 min-h-[calc(100vh-122px)]">
      <div className="max-w-default mx-auto flex min-h-[calc(100vh-170px)]">
        <div className="max-w-[200px]">
          <input
            type="search"
            placeholder="O que você procura?"
            ref={searchRef}
            onKeyUp={handleSearch}
            className="w-full border-2 border-green p-1 mb-2 rounded outline-none"
          />

          <label htmlFor="adsState" className="block font-semibold">Estado:</label>
          <select
            name="State"
            id='adsState'
            className="w-full mb-2 p-1 border-2 border-green rounded outline-none"
            onChange={e => setState(e.target.value)}
          >
            <option value="">Todos</option>
            {stateList && stateList.map((item) => (
              <option key={item._id} value={item.name}>{item.name}</option>
            ))}
          </select>

          <p className="font-semibold">Categoria:</p>
          <ul>
            <li 
              onClick={() => setCategory(null)}
              className={`py-[2px] cursor-pointer hover:bg-green hover:text-white rounded transition-colors ${!category && 'bg-green text-white'}`} 
            >Todos</li>
            {categoryLIst && categoryLIst.map((item) => (
              <li 
                key={item._id} 
                onClick={e => setCategory(item)}
                className={`py-[2px] cursor-pointer hover:bg-green hover:text-white rounded transition-colors ${item.slug === category?.slug && 'bg-green text-white'}`} 
              >{item.name}</li>
            ))}
          </ul>
        </div>

        <div className="flex-1 pl-5">
          <h2 className="font-bold text-2xl mb-5">Resultados:</h2>
          {ads.length > 0 &&
            <div className="grid grid-cols-3 gap-5">
              {ads && ads.map((item) => (
                <Link key={item.id} href={`/ads/${item.id}`} className="bg-white p-3 rounded-lg hover:shadow-lg transition-shadow border-[1px] border-gray-300">
                  <Image src={item.image} width={288} height={288} alt={item.title} className="rounded-t-lg border-[1px] border-gray-300" />
                  <div>
                    <p className="py-1 truncate">{item.title}</p>
                    <div className="font-bold text-xl">{fixPrice(item.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          }

          {ads.length === 0 &&
            <div className='text-center mt-8'>
              <p className='text-gray-700 text-xl'>Nenhum anúncio encontrado</p>
              <span className='text-5xl'>🙈</span>
            </div>
          }
        </div>
      </div>
    </section>
  )
}

export default Ads;