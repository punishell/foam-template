import Axios, { AxiosError, AxiosResponse } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const axios = Axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type ApiResponse<T> = AxiosResponse<{
  message: string;
  data: T;
}>;

export type ApiError<T> = AxiosError<{
  message: string;
  data: T;
}>;