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
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-center">
        <Input
          placeholder="Type your message..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-20 rounded-full border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-purple-500"
        />
        <div className="absolute right-2 flex items-center gap-2">
          <Button
            size="icon"
            type="submit"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-purple-500 hover:text-white transition-colors"
            disabled={!query.trim() || isPending || isMsgLoading}
          >
            {isPending || isMsgLoading || isWbebSearchLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InputQuery;
