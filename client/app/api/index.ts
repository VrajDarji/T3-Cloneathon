// Auth endpoint

import { axios } from "@/utils/axios";

export const login = async (data: { email: string; password: string }) => {
  return await axios.post(`auth/login`, data);
};
