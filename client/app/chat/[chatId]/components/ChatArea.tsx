"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import Message from "./Message";

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
  const isMobile = useIsMobile();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="relative h-full w-full">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur bg-primary/20" />
              <Loader2 className="h-6 w-6 animate-spin text-primary relative" />
            </div>
            <p className="text-sm text-muted-foreground font-medium tracking-tight">Loading messages...</p>
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-muted/20 hover:scrollbar-thumb-muted/30 transition-colors">
          <div className="min-h-full w-full px-3 sm:px-4">
            <div className={`space-y-6 py-6 ${isMobile ? "mx-0" : "mx-4 sm:mx-8 md:mx-16 lg:mx-24"}`}>
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
                  <div className="text-center space-y-3 max-w-md mx-auto px-4">
                    <div className="rounded-xl bg-muted/30 p-6 backdrop-blur-sm">
                      <p className="text-lg font-semibold tracking-tight mb-2">No messages yet</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Start a conversation by typing a message below. Your chat history will appear here.
                      </p>
                    </div>
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
