"use client";
import React from "react";
import { Bot, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

type Props = {
  chats: { senderType: "user" | "llm"; content: string; id: string }[];
  isLoading: boolean;
};

const ChatArea = ({ chats, isLoading }: Props) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {chats.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
          <p className="text-muted-foreground">
            Choose a model and start chatting with AI assistants
          </p>
        </div>
      ) : (
        chats.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.senderType === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.senderType === "llm" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <Card
              className={`max-w-[80%] py-1 px-3 transition-all duration-200 ${
                message.senderType === "user"
                  ? "gradient-primary text-white shadow-lg message-glow"
                  : "glass-effect border-0 shadow-md hover:shadow-lg"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </Card>
            {message.senderType === "user" && (
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))
      )}
      {isLoading && (
        <div className="flex gap-4 justify-start">
          <Avatar className="w-8 h-8">
            <AvatarFallback>
              <Bot className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <Card className="bg-muted p-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
