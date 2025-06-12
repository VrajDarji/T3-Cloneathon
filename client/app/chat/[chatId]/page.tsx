"use client";
import React, { use, useEffect, useState } from "react";
import ChatArea from "./components/ChatArea";
import { useQuery } from "@tanstack/react-query";
import { getAllMsg } from "@/app/api";
import { Loader2 } from "lucide-react";

type Props = {
  params: Promise<{ chatId: string }>;
};

const Page = ({ params }: Props) => {
  const { chatId } = use(params);

  const [chats, setChats] = useState<
    { senderType: "user" | "llm"; content: string; id: string }[]
  >([]);

  const { data, isLoading } = useQuery({
    queryKey: ["allMsgs", chatId],
    queryFn: () => getAllMsg(chatId),
    enabled: !!chatId && chatId !== "new",
    staleTime: 0,
  });

  useEffect(() => {
    setChats([]);

    if (data?.data && chatId !== "new") {
      const { data: rspData } = data;
      setChats(
        rspData.map((chat: any) => ({
          senderType: chat.senderType,
          content: chat.content,
          id: chat.id,
        }))
      );
    }
  }, [data, chatId]);

  return (
    <>
      {(isLoading || !data) && chatId !== "new" ? (
        <div className="w-full h-full flex items-center justify-center flex-col row-gap-4">
          <Loader2 className="w-6 h-6 text-purple-500  animate-spin" />
          <p className="text-md text-purple-500">Loading your chats....</p>
        </div>
      ) : (
        <ChatArea chats={chats} isLoading={isLoading} />
      )}
    </>
  );
};

export default Page;
