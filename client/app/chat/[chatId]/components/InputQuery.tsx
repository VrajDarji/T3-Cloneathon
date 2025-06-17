"use client";

import { askMsg, createNewChat, webSearch } from "@/app/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useChatData, useProfileData } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

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

  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);

  const router = useRouter();

  const queryClient = useQueryClient();

  const isMobile = useIsMobile();

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
        {
          id: rspData.id,
          title: rspData.title,
          createdAt: rspData.createdAt,
          status: rspData.status,
          isPublic: rspData.isPublicccc,
        },
        ...oldChatData,
      ];
      setChatData(chatData);
      if (useWebSearch) {
        webSearchFn(payloadData);
      } else {
        createMessage(payloadData);
      }
      router.push(`/chat/${id}`);
      toast.success("New chat created");
      queryClient.invalidateQueries({ queryKey: ["userChats", userId] });
    },
    onError: (error) => {
      console.log({ error });
      toast.error("Error creating chat!!!", {
        description: "Please try later!!!",
      });
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
    onError: (error) => {
      console.log({ error });
      toast.error("Error fetching message", {
        description: "Please try later!!!",
      });
    },
  });

  const { mutate: webSearchFn, isPending: isWbebSearchLoading } = useMutation({
    mutationFn: (data: {
      chatId: string;
      senderType: "user" | "llm";
      content: string;
    }) => webSearch(data),
    onSuccess: () => {
      setQuery("");
      queryClient.invalidateQueries({ queryKey: ["allMsgs"] });
      setUseWebSearch(false);
    },
    onError: (error) => {
      console.log({ error });
      toast.error("Error fetching result", {
        description: error.message || "Please try later!!!",
      });
    },
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
      if (useWebSearch) {
        webSearchFn(data);
      } else {
        createMessage(data);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center w-full">
        <div className="relative w-full group">
          <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-border/50 via-border to-border/50 opacity-50 group-focus-within:opacity-100 transition-opacity" />
          <Input
            placeholder="Type your message here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 pr-24 py-6 text-base shadow-sm border-border/40 rounded-xl
              bg-background/80 backdrop-blur transition-all duration-200
              focus-visible:ring-1 focus-visible:ring-border
              focus-visible:border-border/60 group-hover:border-border/60"
            disabled={
              isPending || isMsgLoading || isWbebSearchLoading || chatId === "new"
            }
          />
        </div>
        <div className="absolute right-2 flex items-center gap-2">
          <div className="relative">
            <Button
              type="button"
              size="icon"
              variant={useWebSearch ? "default" : "ghost"}
              className="rounded-lg shadow-sm hover:shadow transition-all duration-200"
              onClick={() => setUseWebSearch(!useWebSearch)}
              disabled={
                isPending ||
                isMsgLoading ||
                isWbebSearchLoading ||
                chatId === "new"
              }
            >
              <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <div className="relative">
            <Button
              type="submit"
              size="icon"
              className="rounded-lg shadow-sm hover:shadow transition-all duration-200"
              disabled={
                query.trim() === "" ||
                isPending ||
                isMsgLoading ||
                isWbebSearchLoading ||
                chatId === "new"
              }
            >
              {isPending || isMsgLoading || isWbebSearchLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InputQuery;
