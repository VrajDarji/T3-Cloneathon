"use client";

import { signOut } from "@/app/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import UserModal from "@/components/UserModal";
import { cn } from "@/lib/utils";
import { useChatData, useModal } from "@/store";
import { useMutation } from "@tanstack/react-query";
import { LogOut, MessageSquare, Plus, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";

type Props = {
  activeId: string;
  isOpen: boolean;
};

const SidebarComponent = ({ activeId, isOpen }: Props) => {
  const [chatHistory] = useChatData(useShallow((state) => [state.data]));
  const router = useRouter();

  const [setOpen] = useModal(useShallow((state) => [state.setOpen]));

  const { mutate } = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      router.push("/login");
    },
    onError: (error: any) => {
      console.log({ error });
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return (
    <Sidebar
      className={cn(
        "border-r relative transition-all duration-200",
        isOpen ? "w-[17rem]" : "w-0"
      )}
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            MultiLLM Chat
          </span>
        </div>
        <div className="p-4">
          <Button
            className="w-full justify-start gap-2 gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
            variant="outline"
            onClick={() => router.push(`/chat/new`)}
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <Separator />
        <div className="p-4 flex flex-grow flex-col max-h-[85%] hide-scrollbar overflow-y-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {chatHistory.length === 0
              ? "Your chats will appear here"
              : "Recent Chats"}
          </h3>
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <Card
                key={chat.id}
                className="p-3 cursor-pointer  border-0 glass-effect transition-all duration-200 flex flex-col gap-y-2"
                onClick={() => {
                  if (chat.id !== activeId) {
                    router.push(`/chat/${chat.id}`);
                  }
                }}
              >
                <div className="text-sm font-medium truncate">{chat.title}</div>
                {/* <div className="text-xs text-muted-foreground">
                  {chat.createdAt}
                </div> */}
              </Card>
            ))}
          </div>
        </div>
        <div className="mt-auto p-4 space-y-2 absolute bottom-0 left-0">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() =>
              setOpen(
                <UserModal
                  title="Edit User Details"
                  subheading="Update your display name and persona."
                />
              )
            }
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default SidebarComponent;
