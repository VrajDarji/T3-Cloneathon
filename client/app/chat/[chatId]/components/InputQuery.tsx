"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader, Loader2, Send } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatType, useChatData, useProfileData } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { askMsg, createMsg, createNewChat, webSearch } from "@/app/api";
import { useRouter } from "next/navigation";

type Props = {
  chatId: string;
};

const InputQuery = ({ chatId }: Props) => {
  const [query, setQuery] = useState<string>("");
  const [id, setChatId] = useState<string>(chatId);
  const [user] = useProfileData(useShallow((state) => [state.data]));
  const { id: userId } = user;

  const [oldChatData, setChatData] = useChatData(
    useShallow((state) => [state.data, state.setData])
  );

  const router = useRouter();

  const queryClient = useQueryClient();

  const { mutate: createChat, isPending } = useMutation({
    mutationFn: () => createNewChat({ userId, title: query }),
    onSuccess: (data: any) => {
      const { data: rspData } = data;
      const { id } = rspData;
      const payloadData: {
        chatId: string;
        content: string;
        senderType: "user" | "llm";
      } = {
        chatId: id,
        content: query,
        senderType: "user",
      };
      const chatData = [
        { id: rspData.id, title: rspData.title, createdAt: rspData.createdAt },
        ...oldChatData,
      ];
      setChatData(chatData);
      createMessage(payloadData);
      router.push(`/chat/${id}`);
      queryClient.invalidateQueries({ queryKey: ["userChats", userId] });
    },
  });

  const { mutate: createMessage, isPending: isMsgLoading } = useMutation({
    mutationFn: (data: {
      chatId: string;
      senderType: "user" | "llm";
      content: string;
    }) => askMsg(data),
    onSuccess: () => {
      setQuery("");
      queryClient.invalidateQueries({ queryKey: ["allMsgs"] });
    },
    onError: () => {},
  });

  const { mutate: webSearchFn, isPending: isWbebSearchLoading } = useMutation({
    mutationFn: (query: string) => webSearch(query),
    onSuccess: () => {},
    onError: () => {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatId === "") {
      createChat();
    } else {
      const data: {
        chatId: string;
        content: string;
        senderType: "user" | "llm";
      } = {
        chatId,
        content: query,
        senderType: "user",
      };
      createMessage(data);
    }
  };

  return (
    <div className="border-t border-border/50 p-4 glass-effect">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 glass-effect border-0 shadow-sm focus:shadow-md transition-all duration-200"
            disabled={isPending || isMsgLoading}
          />
          <Button
            type="submit"
            disabled={isPending || isMsgLoading}
            className="gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {isPending || isMsgLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InputQuery;
