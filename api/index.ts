import { Category } from "@/types";

const BASE_URL = 'https://lcstore-api.onrender.com'; // open url

export default {
    getCategories: async () => {
        const response: {categories: Category[]} = await fetch(BASE_URL + '/categories').then(res => res.json());
        return response.categories;
    }
}