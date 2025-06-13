"use client";

import React, { useEffect, useRef } from "react";
import Message from "./Message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface ChatAreaProps {
  chats: Array<{
    senderType: "user" | "llm";
    content: string;
    id: string;
  }>;
  isLoading: boolean;
}

const ChatArea = ({ chats, isLoading }: ChatAreaProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="h-full overflow-y-auto">
          <div className="min-h-full w-full px-4">
            <div className="space-y-6 py-4 mx-auto">
              {chats.map((chat) => (
                <Message
                  key={chat.id}
                  id={chat.id}
                  content={chat.content}
                  senderType={chat.senderType}
                />
              ))}
              {chats.length === 0 && (
                <div className="flex h-[calc(100vh-15rem)] items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start a conversation by typing a message below
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
