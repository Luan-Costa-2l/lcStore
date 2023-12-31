import { fixPrice } from "@/helpers/Formaters";
import Image from "next/image";
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
            <Image src={url} alt={title} width={245} height={245} className="rounded-t-lg border-[1px] border-gray-300" />
            <div>
                <p className="py-1 truncate">{title}</p>
                <div className="font-bold text-xl">{fixPrice(price)}</div>
            </div>
        </Link>
    )
}