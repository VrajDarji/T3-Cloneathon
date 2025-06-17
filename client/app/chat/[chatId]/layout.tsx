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
        className={`grid h-screen w-full ${
          isMobile ? "" : "grid-cols-[auto_1fr]"
        }`}
      >
        {/* Sidebar */}
        <SidebarComponent activeId={chatId} isOpen={isOpen} />

        {/* Main Chat Area */}
        <div className="flex flex-col h-screen w-full relative overflow-hidden">
          {/* Header */}
          <div className="relative z-10">
            <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0" />
            <Header setIsOpen={setIsOpen} />
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-hidden relative w-full pb-28">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.015] pointer-events-none" />
            <div className="relative h-full">{children}</div>
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="relative">
              {/* Top border gradient */}
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-border/0 via-border/50 to-border/0" />

              {/* Background with blur */}
              <div className="bg-background/80 backdrop-blur-xl relative">
                <div className="p-4 w-full max-w-[100vw] mx-auto">
                  <div className="max-w-screen-lg mx-auto">
                    <InputQuery chatId={chatId !== "new" ? chatId : ""} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
