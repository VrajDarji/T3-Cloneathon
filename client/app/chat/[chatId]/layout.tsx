"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Send } from "lucide-react";
import React, { use, useState } from "react";
import Header from "./components/Header";
import SidebarComponent from "./components/SidebarComponent";
import { useSidebar } from "@/components/sidebar";
import InputQuery from "./components/InputQuery";

type Props = {
  params: Promise<{ chatId: string }>;
  children: React.ReactNode;
};

export default function ChatPage({ params, children }: Props) {
  const { chatId } = use(params);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const userId = "";

  return (
    <SidebarProvider>
      <div className="grid h-screen w-full bg-gradient-to-br from-background via-background to-muted/30 grid-cols-[auto_1fr] relative">
        {/* Sidebar */}
        <SidebarComponent activeId={chatId} isOpen={isOpen} />
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <Header setIsOpen={setIsOpen} />
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">{children}</ScrollArea>

          {/* Input Area */}
          <InputQuery chatId={chatId !== "new" ? chatId : ""} />
        </div>
      </div>
    </SidebarProvider>
  );
}
