import Axios, { AxiosError, AxiosResponse } from 'axios';
import { redirect } from 'next/navigation';

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
    if (error.response.status === 401) {
      redirect('/login');
    }
    return Promise.reject(error);
  },
);

export type ApiResponse<T> = AxiosResponse<{
  message: string;
  data: T;
}>;

export type ApiError<T> = AxiosError<{
  message: string;
  data: T;
}>;