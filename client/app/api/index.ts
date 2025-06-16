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

export const signOut = async () => {
  return await axios.post(`auth/sign-out`);
};

// User endpoints

export const updateUser = async (data: {
  id: string;
  name: string;
  persona: string;
}) => {
  return await axios.patch(`users/${data.id}`, data);
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

export const createBranch = async (data: {
  userId: string;
  parentId: string;
  branchedFromMsgId: string;
}) => {
  try {
    // Add error handling and proper request configuration
    const response = await axios.post(`chats/branch`, data, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Branch creation error:", error);
    throw error;
  }
};

// Message endpoints

export const getAllMsg = async (chatId: string) => {
  try {
    const response = await axios.get(`messages/chats/${chatId}`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
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
