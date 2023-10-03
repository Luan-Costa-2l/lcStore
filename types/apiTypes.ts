import { AdType, UserType } from ".";

export interface FormatQueryFiltersParams {
  sort?: 'asc' | 'desc';
  offset?: number;
  limit?: string;
  q?: string;
  cat?: string;
  state?: string;
  token?: string;
}

export interface GetAdsParams {
  sort?: 'asc' | 'desc';
  offset?: number;
  limit?: string;
  q?: string;
  cat?: string;
  state?: string
}


export interface ErrorResponseType {
  error: { [tag: string]: { msg: string } }
}

export interface SignupParamsType {
  name: string;
  email: string;
  state: string;
  password: string;
}

export type GetUserInfoReturn = { userInfo: UserType } | { error: string };

export interface UpdateUserInfoParams extends SignupParamsType {
  newPassword?: string;
}

export type UpdateUserInfoReturn = { updated: boolean } | ErrorResponseType;

export interface UpdateAdInfoParams extends Omit<AdType, 'image'> {
  description: string;
  category: string;
  img: File[];
  token: string;
}