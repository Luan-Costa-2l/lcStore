import { Category, State } from "@/types";

const BASE_URL = process.env.NODE_ENV == 'production' ? 'https://lcstore-api.onrender.com' : 'http://localhost:8080'; // open url


export default {
    getCategories: async () => {
        const response: {categories: Category[]} = await fetch(BASE_URL + '/categories').then(res => res.json());
        return response.categories;
    },
    getStates: async () => {
        const response: { states: State[] } = await fetch(BASE_URL + '/states').then(res => res.json());
        return response.states;
    },
}