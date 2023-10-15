import { AdInfo, AdType, Category, State } from "@/types";
import { 
    CreateNewAdParams,
    ErrorResponseType, 
    FormatQueryFiltersParams, 
    GetAdsParams, 
    GetUserInfoReturn, 
    SignupParamsType, 
    UpdateAdInfoParams, 
    UpdateUserInfoParams, 
    UpdateUserInfoReturn 
} from "@/types/apiTypes";
import Cookies from "js-cookie";

const BASE_URL = process.env.NODE_ENV == 'production' ? 'https://lcstore-api.onrender.com' : 'http://localhost:8080'; // open url

const formatQueryFilters = ({ sort, offset, limit, q, cat, state, token }: FormatQueryFiltersParams) => {
    let filters: string[] = [];
    if (token) {
        filters.push(`token=${token}`);
    }
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
        const query = formatQueryFilters({ sort, offset, limit, q, cat, state });
        const response: { ads: AdType[], total: number } = await fetch(BASE_URL + '/ad/list' + query, { next: { revalidate: 60 * 60 * 2 } })
            .then(res => res.json());
        return response;
    },
    getAdInfo: async (id: string, other: boolean = false) => {
        try {
            const query = other ? `?other=${other}` : '';
            const response = await fetch(BASE_URL + `/ad/${id}` + query, { next: { revalidate: 60 * 60 * 2 } });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Error desconhecido');
            }
            const responseData: { error: string } | AdInfo = await response.json();
            if ('error' in responseData) {
                console.error('Erro durante o registro: ', responseData.error);
                throw new Error('Ocorreu um erro durante a requisição, tente novamente mais tarde.');  
            }
            return responseData;
        } catch (err) {
            console.error('Erro durante o registro: ', err);
            throw new Error('Ocorreu um erro durante a requisição, tente novamente mais tarde.');  
        }
    },
    signup: async ({ name, email, state, password }: SignupParamsType) => {
        try {
            const response = await fetch(BASE_URL + '/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, state, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Erro desconhecido');
            }
            const responseData: ErrorResponseType | { token: string } = await response.json();
            return responseData;
        } catch (error) {
            console.error('Erro durante o registro: ', error);
            throw new Error('Ocorreu um erro durante o registro, tente novamente mais tarde.');
        }
    },
    signin: async ({ email, password }: {email: string, password: string}): Promise<ErrorResponseType | { token: string, email: string }> => {
        try {
            const response = await fetch(BASE_URL + '/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Erro desconhecido');
            }

            const responseData: ErrorResponseType | { token: string, email: string } = await response.json();
            return responseData;
        } catch (err) {
            console.error('Erro durante o login: ', err);
            throw new Error('Ocorreu um erro durante o login');
        }
    },
    getUserInfo: async (token: string, sort?: 'asc' | 'desc', offset?: number, limit?: string, q?: string, cat?: string): Promise<GetUserInfoReturn> => {
        try {
            const query = formatQueryFilters({ sort, offset, limit, q, cat, token });
            const response = await fetch(BASE_URL + '/user/me' + query);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Erro desconhecido');
            }

            const responseData: GetUserInfoReturn = await response.json();
            return responseData;
        } catch (err) {
            console.error('Erro ao requerir informações: ', err);
            throw new Error('Erro ao requerir informações do usuário');
        }
    },
    updateUserInfo: async ({ name, email, state, password, newPassword }: UpdateUserInfoParams): Promise<UpdateUserInfoReturn> => {
        try {
            const token = Cookies.get('token') || '';
            const response = await fetch(BASE_URL + '/user/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, state, password, newPassword, token })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Erro desconhecido');
            }

            const responseData: UpdateUserInfoReturn = await response.json();
            return responseData;
        } catch (err) {
            console.error('Erro ao atualizar informações: ', err);
            throw new Error('Ocorreu um erro ao atualizar informações de usuário');
        }
    },
    updateAdInfo: async ({ id, category, description, img, price, priceNegotiable, title }: UpdateAdInfoParams) => {
        try {
            const token = Cookies.get('token') || '';
            const formData = new FormData();
            formData.append('token', token)
            if (title) {
                formData.append('title', title);
            }
            if (category) {
                formData.append('category', category);
            }
            if (price) {
                formData.append('price', price.toString());
            }
            if (priceNegotiable) {
                formData.append('priceNegotiable', priceNegotiable.toString());
            }
            if (description) {
                formData.append('description', description);
            }
            if (img) {
                img.forEach(file => formData.append('img', file));
            }
            const response = await fetch(BASE_URL + `/ad/${id}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Erro desconhecido');
            }

            const responseData = await response.json();
            return responseData as { updated: boolean } | ErrorResponseType;
        } catch(err) {
            console.error('Erro ao atualizar informações do anúncio: ', err);
            throw new Error('Ocorreu um erro ao atualizar informações do anúncio');
        }
    },
    createNewAd: async (data: CreateNewAdParams) => {
        const token = Cookies.get('token') || '';
        const formData = new FormData();
        formData.append('token', token);
        formData.append('title', data.title);
        formData.append('category', data.category);
        formData.append('price', data.price.toString());
        formData.append('priceNegotiable', data.priceNegotiable.toString());
        formData.append('description', data.description);
        data.img.forEach(file => formData.append('img', file));
        
        try {
            const response = await fetch(BASE_URL + '/ad/add', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || 'Erro desconhecido');
            }

            const responseData = await response.json();
            return responseData as { id: string } | ErrorResponseType;
        } catch(err) {
            console.error('Erro ao criar um novo anúncio: ', err);
            throw new Error('Ocorreu um erro ao atualizar informações do anúncio');
        }
    }
}