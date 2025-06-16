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
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`relative flex items-center ${
          isMobile ? "min-w-[400px]" : "min-w-[800px]"
        } `}
      >
        <Input
          placeholder="Ask Anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:pr-0 md:pr-20 rounded-full border-muted-foreground/20 focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-purple-500"
        />

        <div className="absolute right-2 flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant={useWebSearch ? "default" : "ghost"}
            className={`rounded-full px-2 transition-colors ${
              useWebSearch
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "text-muted-foreground"
            }`}
            onClick={() => setUseWebSearch((prev) => !prev)}
          >
            <Globe className="h-4 w-4" /> Web Search
          </Button>
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
