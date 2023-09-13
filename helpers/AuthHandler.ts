import Cookies from "js-cookie";

export const doLogin = (stayLogged: boolean = false, token: string): void => {
  if (stayLogged) {
    const DAYS_TO_EXPIRES_THE_COOKIES = 60;
    Cookies.set('token', token, { expires: DAYS_TO_EXPIRES_THE_COOKIES });
    return;
  }
  Cookies.set('token', token);
}

export const isLogged = (): boolean => {
  const token = Cookies.get('token');
  return !!token;
}

export const doLogout = (): void => {
  Cookies.remove('token');
}