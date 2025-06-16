"use client";
import { getPublicMsgs } from "@/app/api";
import ChatArea from "@/app/chat/[chatId]/components/ChatArea";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { use, useEffect, useState } from "react";

type Props = {
  params: Promise<{ chatId: string }>;
};

const Page = ({ params }: Props) => {
  const { chatId } = use(params);

  const [chats, setChats] = useState<
    { senderType: "user" | "llm"; content: string; id: string }[]
  >([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["allPublicMsgs", chatId],
    queryFn: () => getPublicMsgs(chatId),
    enabled: !!chatId && chatId !== "new",
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });
  useEffect(() => {
    setChats([]);

    if (data?.data && chatId !== "new") {
      const { data: rspData } = data;
      if (Array.isArray(rspData)) {
        const messages = rspData.map((msg: any) => ({
          senderType: msg.senderType,
          content: msg.content,
          id: msg.id,
        }));
        setChats(messages);
      } else {
        console.error("Unexpected response format:", rspData);
      }
    }
  }, [data, chatId]);
  return (
    <>
      {error ? (
        <div className="w-full h-full flex items-center justify-center flex-col row-gap-4">
          <p className="text-md text-red-500">
            Error loading messages. Please try again.
          </p>
        </div>
      ) : (isLoading || !data) && chatId !== "new" ? (
        <div className="w-full h-full flex items-center justify-center flex-col row-gap-4">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          <p className="text-md text-purple-500">Loading messages...</p>
        </div>
      ) : (
        <ChatArea chats={chats} isLoading={isLoading} />
      )}
    </>
  );
};

export default Page;
