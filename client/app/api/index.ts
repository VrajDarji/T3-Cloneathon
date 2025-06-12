import { axios } from "@/utils/axios";

// Auth endpoint

export const login = async (data: { email: string; password: string }) => {
  return await axios.post(`auth/login`, data);
};

export const signUp = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  return await axios.post(`auth/sign-up`, data);
};

// Chat endpoints

export const getAllChats = async (userId: string) => {
  return await axios.get(`chats/user/${userId}`);
};

export const createNewChat = async (data: {
  userId: string;
  title?: string;
  parentId?: string;
  branchedFromMsgId?: string;
}) => {
  return await axios.post(`chats`, data);
};

// Message endpoints

export const getAllMsg = async (chatId: string) => {
  return await axios.get(`messages/chats/${chatId}`);
};

export const createMsg = async (data: {
  chatId: string;
  senderType: "user" | "llm";
  content: string;
}) => {
  return await axios.post(`messages`, data);
};

export const askMsg = async (data: {
  chatId: string;
  senderType: "user" | "llm";
  content: string;
}) => {
  return await axios.post(`messages/ask`, data);
};

export const webSearch = async (query: string) => {
  return await axios.post(`messages/web-search?query=${query}`);
};
