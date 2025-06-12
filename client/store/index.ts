import { create } from "zustand";
import { persist } from "zustand/middleware";

type userData = {
  id: string;
  email: string;
  name: string;
  persona: string;
};

type ProfileData = {
  data: userData;
  setData: (d: userData) => void;
};

export const useProfileData = create<ProfileData>()(
  persist<ProfileData>(
    (set) => ({
      data: { id: "", email: "", name: "", persona: "" },
      setData: (data: userData) => set({ data: data }),
    }),
    {
      name: "user-data",
    }
  )
);

export type chatType = {
  title: string;
  id: string;
  createdAt: string;
};

type chatStoreTypes = {
  data: chatType[];
  setData: (d: chatType[]) => void;
};

export const useChatData = create<chatStoreTypes>()(
  persist<chatStoreTypes>(
    (set) => ({
      data: [],
      setData: (d: chatType[]) => set({ data: d }),
    }),
    {
      name: "chat-data",
    }
  )
);
