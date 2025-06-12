import Axios, { InternalAxiosRequestConfig } from "axios";

const authRequestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  config.headers.Accept = "application/json";
  return config;
};

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axios.interceptors.request.use(authRequestInterceptor);
