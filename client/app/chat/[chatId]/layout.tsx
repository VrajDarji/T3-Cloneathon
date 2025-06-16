"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { use, useState } from "react";
import Header from "./components/Header";
import InputQuery from "./components/InputQuery";
import SidebarComponent from "./components/SidebarComponent";

type Props = {
  params: Promise<{ chatId: string }>;
  children: React.ReactNode;
};

export default function ChatPage({ params, children }: Props) {
  const { chatId } = use(params);
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div
        className={`grid h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 ${
          isMobile ? "" : "grid-cols-[auto_1fr]"
        }`}
      >
        {/* Sidebar */}
        <SidebarComponent activeId={chatId} isOpen={isOpen} />

        {/* Main Chat Area */}
        <div className="flex flex-col h-screen w-full relative overflow-hidden">
          {/* Header */}
          <Header setIsOpen={setIsOpen} />

          {/* Messages Area - Takes all available space */}
          <div className="flex-1 overflow-hidden relative w-full ">
            {children}
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 flex items-center justify-center glass-effect fixed bottom-0 left-0 w-full">
            <div className="container py-4 flex items-center justify-center w-full relative">
              <InputQuery chatId={chatId !== "new" ? chatId : ""} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
