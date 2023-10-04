import Axios, { AxiosError, AxiosResponse } from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { redirect } from 'next/navigation';
import { AUTH_TOKEN_KEY } from './utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axios = Axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosDefault = Axios.create({
  headers: { 'Access-Control-Allow-Origin': '*' },
  responseType: 'blob',
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('status-code==>:', error.response.status, error.response.status === 401);
    if (error.response.status === 401) {
      deleteCookie(AUTH_TOKEN_KEY);
      return window ? window.location.replace('/login') : redirect('login');
    }
    return Promise.reject(error);
  },
);

export type ApiResponse<T = any> = AxiosResponse<{
  message: string;
  data: T;
}>;

export type ApiError<T = any> = AxiosError<{
  message: string;
  data?: T;
}>;
