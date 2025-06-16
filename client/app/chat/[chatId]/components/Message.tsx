"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Check, Copy, GitBranch, Loader2, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBranch } from "@/app/api";
import { useProfileData, useChatData } from "@/store";
import { useShallow } from "zustand/react/shallow";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import typescript from "react-syntax-highlighter/dist/cjs/languages/prism/typescript";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";
import json from "react-syntax-highlighter/dist/cjs/languages/prism/json";
import ReactMarkdown from "react-markdown";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

// Register commonly used languages
SyntaxHighlighter.registerLanguage("js", javascript);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("ts", typescript);
SyntaxHighlighter.registerLanguage("typescript", typescript);
SyntaxHighlighter.registerLanguage("py", python);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("sh", bash);
SyntaxHighlighter.registerLanguage("json", json);

interface MessageProps {
  content: string;
  senderType: "user" | "llm";
  id: string;
}

const Message = ({ content, senderType, id }: MessageProps) => {
  const [copied, setCopied] = useState(false);
  const [codeBlockCopied, setCodeBlockCopied] = useState<{
    [key: string]: boolean;
  }>({});
  const [user] = useProfileData(useShallow((state) => [state.data]));
  const [oldChatData, setChatData] = useChatData(
    useShallow((state) => [state.data, state.setData])
  );
  const params = useParams<{ chatId: string }>();
  const router = useRouter();

  const queryClient = useQueryClient();

  const { theme } = useTheme();

  const { mutate: branchChat, isPending } = useMutation({
    mutationFn: (data: {
      userId: string;
      parentId: string;
      branchedFromMsgId: string;
    }) => createBranch(data),
    onSuccess: (data: any) => {
      const { data: rspData } = data;

      // Add new chat to state
      const chatData = [
        {
          id: rspData.id,
          title: rspData.title,
          createdAt: rspData.createdAt,
          parentId: params.chatId,
          branchedFromMsgId: id,
        },
        ...oldChatData,
      ];
      setChatData(chatData);

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["userChats", user.id] });
      queryClient.invalidateQueries({ queryKey: ["allMsgs"] });

      // Wait a short moment for the state to update
      setTimeout(() => {
        // Navigate to new chat and ensure data is fresh
        router.push(`/chat/${rspData.id}`);
      }, 100);
    },
    onError: (error) => {
      console.error("Failed to create branch:", error);
    },
  });

  const handleCopy = async (text: string, blockId?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (blockId) {
        setCodeBlockCopied((prev) => ({ ...prev, [blockId]: true }));
        setTimeout(() => {
          setCodeBlockCopied((prev) => ({ ...prev, [blockId]: false }));
        }, 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderBranchButton = () => (
    <button
      type="button"
      className="inline-flex items-center justify-center text-xs text-muted-foreground hover:text-foreground px-3 h-8 rounded-md disabled:opacity-50 disabled:pointer-events-none hover:bg-accent"
      onClick={(e) => {
        e.preventDefault();
        try {
          const data = {
            userId: user.id,
            parentId: params.chatId,
            branchedFromMsgId: id,
          };
          branchChat(data);
        } catch (error) {
          console.error("Error triggering branch:", error);
        }
      }}
      disabled={isPending}
    >
      <div className="flex items-center gap-1.5">
        {isPending ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Branching...</span>
          </>
        ) : (
          <>
            <GitBranch className="h-3 w-3" />
            <span>Branch</span>
          </>
        )}
      </div>
    </button>
  );

  const renderCopyButton = () => (
    <button
      type="button"
      className="inline-flex items-center justify-center text-xs text-muted-foreground hover:text-foreground px-3 h-8 rounded-md hover:bg-accent"
      onClick={(e) => {
        e.preventDefault();
        handleCopy(content);
      }}
    >
      <div className="flex items-center gap-1.5">
        {copied ? (
          <>
            <Check className="h-3 w-3" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-3 w-3" />
            <span>Copy response</span>
          </>
        )}
      </div>
    </button>
  );

  const renderCodeCopyButton = (codeContent: string, blockId: string) => (
    <button
      type="button"
      className="absolute right-2 top-2 inline-flex items-center justify-center p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-muted-foreground hover:text-foreground hover:bg-accent"
      onClick={(e) => {
        e.preventDefault();
        handleCopy(codeContent, blockId);
      }}
    >
      {codeBlockCopied[blockId] ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );

  return (
    <div
      className={`flex w-full ${
        senderType === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`gap-4  ${
          senderType === "llm"
            ? "bg-muted/30 py-6 px-4 rounded-lg flex w-full sm:max-w-[85%]"
            : "bg-primary/10 py-1 px-4 rounded-lg inline-flex max-w-fit"
        } ${senderType === "user" ? "flex-row-reverse" : "flex-row"}`}
      >
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback
            className={`text-white ${
              senderType === "llm"
                ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                : "bg-gradient-to-br from-green-600 to-teal-600"
            }`}
          >
            {senderType === "llm" ? (
              <Bot className="h-4 w-4" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4 text-left break-words">
          <div className="prose prose-neutral dark:prose-invert max-w-[120ch]">
            <ReactMarkdown
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const codeContent = String(children).replace(/\n$/, "");
                  const blockId = Math.random().toString(36).substr(2, 9);

                  if (match) {
                    return (
                      <div className="relative group text-left">
                        {renderCodeCopyButton(codeContent, blockId)}
                        <div className="rounded-md overflow-hidden bg-muted/50">
                          <SyntaxHighlighter
                            style={theme === "dark" ? oneDark : oneLight}
                            language={match[1]}
                            customStyle={{
                              margin: 0,
                              background: "transparent",
                            }}
                            PreTag="div"
                            showLineNumbers={true}
                            wrapLines={true}
                          >
                            {codeContent}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {senderType === "llm" && content.trim().length > 0 && (
            <div className="flex items-center gap-2">
              {renderCopyButton()}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {renderBranchButton()}
                  </TooltipTrigger>
                  <TooltipContent>Branch from this message</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
