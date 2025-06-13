"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { use, useState } from "react";
import Header from "./components/Header";
import SidebarComponent from "./components/SidebarComponent";
import InputQuery from "./components/InputQuery";

type Props = {
  params: Promise<{ chatId: string }>;
  children: React.ReactNode;
};

export default function ChatPage({ params, children }: Props) {
  const { chatId } = use(params);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <SidebarProvider>
      <div className="grid h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 grid-cols-[auto_1fr]">
        {/* Sidebar */}
        <SidebarComponent activeId={chatId} isOpen={isOpen} />

        {/* Main Chat Area */}
        <div className="flex flex-col h-screen relative">
          {/* Header */}
          <Header setIsOpen={setIsOpen} />

          {/* Messages Area - Takes all available space */}
          <div className="flex-1 overflow-hidden relative">
            {children}
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
            <div className="container max-w-3xl py-4">
              <InputQuery chatId={chatId !== "new" ? chatId : ""} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
