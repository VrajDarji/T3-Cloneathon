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
        <div className="flex flex-col h-screen w-full relative">
          {/* Header */}
          <Header setIsOpen={setIsOpen} />

          {/* Messages Area - Takes all available space */}
          <div className="flex-1 overflow-hidden relative w-full pb-36">
            {children}
          </div>

          {/* Input Area */}
          <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 absolute bottom-0 left-0 right-0">
            <div
              className={`${
                isMobile ? "p-2" : "p-4"
              } w-full max-w-screen-xl mx-auto`}
            >
              <InputQuery chatId={chatId !== "new" ? chatId : ""} />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
