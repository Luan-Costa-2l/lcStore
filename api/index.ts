import { AdType, Category, State } from "@/types";

const BASE_URL = process.env.NODE_ENV == 'production' ? 'https://lcstore-api.onrender.com' : 'http://localhost:8080'; // open url

const formatQueryFilters = (sort?: 'asc' | 'desc', offset?: number, limit?: string, q?: string, cat?: string, state?: string) => {
    let filters: string[]  = [];
    if (sort) {
        filters.push(`sort=${sort}`);
    }
    if (offset) {
        filters.push(`offset=${offset}`);
    }
    if (limit) {
        filters.push(`limit=${limit}`);
    }
    if (q) {
        filters.push(`q=${q}`);
    }
    if (cat) {
        filters.push(`cat=${cat}`);
    }
    if (state) {
        filters.push(`state=${state}`);
    }
    if (filters.length === 0) {
        return '';
    }
    return '?' + filters.join('&');
}

interface GetAdsParams {
    sort?: 'asc' | 'desc';
    offset?: number;
    limit?: string;
    q?: string;
    cat?: string;
    state?: string
}

export default {
    getCategories: async () => {
        const response: {categories: Category[]} = await fetch(BASE_URL + '/categories').then(res => res.json());
        return response.categories;
    },
    getStates: async () => {
        const response: { states: State[] } = await fetch(BASE_URL + '/states').then(res => res.json());
        return response.states;
    },
    getAds: async ({ sort, offset, limit, q, cat, state }: GetAdsParams) => {
        const query = formatQueryFilters(sort, offset, limit, q, cat, state);
        const response: { ads: AdType[], total: number } = await fetch(BASE_URL + '/ad/list' + query, { next: { revalidate: 60 * 60 * 2 } })
            .then(res => res.json());
        return response;
    }
}