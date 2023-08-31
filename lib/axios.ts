import Axios, { AxiosError, AxiosResponse } from 'axios';
import { deleteCookie } from 'cookies-next';
import { redirect } from 'next/navigation';
import { AUTH_TOKEN_KEY } from './utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axios = Axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('error====', error.response, error);
    if (error.response.status === 401) {
      deleteCookie(AUTH_TOKEN_KEY);
      return redirect('/login');
    }
    return Promise.reject(error);
  },
);

export type ApiResponse<T> = AxiosResponse<{
  message: string;
  data: T;
}>;

export type ApiError<T = any> = AxiosError<{
  message: string;
  data?: T;
}>;
