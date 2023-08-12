
export interface Category {
    _id: string;
    name: string;
    slug: string;
}

export interface State {
    _id: string;
    name: string;
}

export interface AdType {
    id: string;
    title: string;
    price: number;
    priceNegotiable: boolean;
    image: string;
}