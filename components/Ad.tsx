import Link from "next/link";

type Props = {
    id: string;
    url: string;
    title: string;
    price: number;
}

export const Ad = async ({ id, url, title, price }: Props) => {
    return (
        <Link href={`/ads/${id}`} className="bg-white p-3 rounded-lg hover:shadow-lg transition-shadow border-[1px] border-gray-300">
            <img src={url} alt={title} className="rounded-t-lg" />
            <div>
                <p className="py-1">{title}</p>
                <div className="font-bold text-xl">{price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})}</div>
            </div>
        </Link>
    )
}