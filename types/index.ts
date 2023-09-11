
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

export interface AdInfo extends Omit<AdType, 'image'> {
    description: string;
    dateCreated: Date;
    views: number;
    stateName: string;
    category: string;
    images: string[];
    userInfo: {
        name: string;
        email: string;
    };
    others: AdType[];
}