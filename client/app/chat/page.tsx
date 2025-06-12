"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { createNewChat, getAllChats } from "../api";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChatData, useProfileData } from "@/store";
import { useShallow } from "zustand/react/shallow";
export default function ChatPage() {
  const [user] = useProfileData(useShallow((state) => [state.data]));
  const { id: userId } = user;

  const router = useRouter();

  const [chatData, setChatData] = useChatData(
    useShallow((state) => [state.data, state.setData])
  );

  const { data, isLoading } = useQuery({
    queryKey: ["userChats", userId],
    queryFn: () => getAllChats(userId),
    enabled: !!userId,
  });

  useEffect(() => {
    if (data?.data) {
      const { data: rspData } = data;
      if (rspData.length === 0) {
        setChatData([]);
        router.push(`/chat/new`);
      } else {
        const latestChat = rspData?.[0];
        setChatData(
          rspData.map((data: any) => ({
            id: data.id,
            title: data.title,
            createdAt: data.createdAt,
          }))
        );
        router.push(`/chat/${latestChat.id}`);
      }
    }
  }, [data, setChatData, router, userId]);

  return (
    <div className="h-screen w-full flex items-center justify-center gap-3 flex-col text-purple-500">
      <Loader className="animate-spin" />
      <p>Loading...</p>
    </div>
  );
}
