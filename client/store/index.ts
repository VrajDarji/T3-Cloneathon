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
  isPublic: boolean;
  status: string;
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

type ModalContextType = {
  data: any;
  isOpen: boolean;
  modal: React.ReactNode | null;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
};

export const useModal = create<ModalContextType>((set, get) => ({
  data: {},
  isOpen: false,
  modal: null,
  setOpen: async (modal: React.ReactNode, fetchData?: () => Promise<any>) => {
    if (modal) {
      if (fetchData) {
        const newData = await fetchData();
        set({ data: { ...get().data, ...newData }, modal });
      } else {
        set({ isOpen: true, modal });
      }
    }
  },
  setClose: () => set({ isOpen: false, data: {}, modal: null }),
}));
