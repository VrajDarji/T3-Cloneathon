"use client";

import { deleteChat, editChat, makePublic, signOut } from "@/app/api";
import PublicModal from "@/components/PublicModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import UserModal from "@/components/UserModal";
import { cn } from "@/lib/utils";
import { chatType, useChatData, useModal } from "@/store";
import { useMutation } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  Loader,
  LogOut,
  MessageSquare,
  MoreHorizontal,
  Package,
  Plus,
  Settings,
  Star,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

type Props = {
  activeId: string;
  isOpen: boolean;
};

type RenderChatProps = {
  chat: chatType;
  activeId: string;
  isLoading: boolean;
  handleEditChat: (
    type: "delete" | "archive" | "important",
    id: string
  ) => void;
  makePublicFn: (id: string) => void;
};

const RenderChatCard = ({
  chat,
  activeId,
  isLoading,
  handleEditChat,
  makePublicFn,
}: RenderChatProps) => {
  const router = useRouter();
  return (
    <Card
      key={chat.id}
      className="px-3 py-1 cursor-pointer  border-0 glass-effect transition-all duration-200 flex flex-row gap-y-2 items-center"
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
      <DropdownMenu key={chat.id}>
        <DropdownMenuTrigger asChild>
          <Button className="flex ml-auto" size={"icon"} variant={"ghost"}>
            {isLoading ? (
              <Loader className="animate-spin" />
            ) : (
              <MoreHorizontal />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="glass-effect">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleEditChat("archive", chat.id);
            }}
          >
            <Package />
            Archive Chat
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleEditChat("important", chat.id);
            }}
          >
            <Star />
            Star Chat
          </DropdownMenuItem>
          {!chat.isPublic && (
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                makePublicFn(chat.id);
              }}
            >
              <Globe />
              Make Public
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleEditChat("delete", chat.id);
            }}
            className="text-rose-500 hover:text-rose-600 active:text-rose-600"
          >
            <Trash className="text-rose-500" />
            Delete Chat
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

const SidebarComponent = ({ activeId, isOpen }: Props) => {
  const [chatHistory, setChatHistory] = useChatData(
    useShallow((state) => [state.data, state.setData])
  );

  const [isArchivedOpen, setIsArchivedOpen] = useState(false);
  const [isStarredOpen, setIsStarredOpen] = useState(false);

  const [mutateId, setMutateId] = useState<string | null>(null);

  const router = useRouter();

  const [setOpen] = useModal(useShallow((state) => [state.setOpen]));

  const { mutate } = useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error("Logout failed");
      console.log({ error });
    },
  });

  const handleLogout = () => {
    mutate();
  };

  const { mutate: editChatFn, isPending: isEditLoading } = useMutation({
    mutationFn: (data: { id: string; status: "archived" | "starred" }) =>
      editChat(data),
    onSuccess: (data: any) => {
      const { data: rspData } = data;
      const updatedData = chatHistory.map((chat) =>
        chat.id === rspData.id
          ? {
              id: rspData.id,
              isPublic: rspData.isPublic,
              status: rspData.status,
              title: rspData.title,
              createdAt: rspData.createdAt,
            }
          : chat
      );
      setMutateId(null);
      setChatHistory(updatedData);
      toast.success(
        rspData.status === "starred"
          ? "Chat starred successfully"
          : "Chat archived successfully"
      );
    },
    onError: () => {
      toast.error("Failed to update chat");
    },
  });

  const { mutate: deleteChatFn, isPending: isDeleteChatLoading } = useMutation({
    mutationFn: (id: string) => deleteChat(id),
    onSuccess: (data) => {
      const { data: rspData } = data;
      const updatedData = chatHistory.filter((chat) => chat.id !== rspData.id);
      setChatHistory(updatedData);
      toast.success("Chat deleted");
      setMutateId(null);
    },
    onError: () => {
      toast.error("Failed to delete chat");
    },
  });

  const { mutate: makePublicFn, isPending: isPublicLoading } = useMutation({
    mutationFn: (id: string) => makePublic(id),
    onSuccess: (data) => {
      const { data: rspData } = data;
      const updatedData = chatHistory.map((chat) =>
        chat.id === rspData.id
          ? {
              id: rspData.id,
              isPublic: rspData.isPublic,
              status: rspData.status,
              title: rspData.title,
              createdAt: rspData.createdAt,
            }
          : chat
      );
      setChatHistory(updatedData);
      setMutateId(null);
      toast.success("Chat is now public!");
      setOpen(
        <PublicModal
          title="Your Chat is Public"
          subheading="This is a one-time access link. Share it with care—anyone with the link can view your chat once."
          publicId={rspData.publicId}
        />
      );
    },
    onError: (error: any) => {
      console.log({ error });
      toast.error("Failed to make chat public");
    },
  });

  const handleEditChat = (
    type: "archive" | "important" | "delete",
    id: string
  ) => {
    setMutateId(id);
    if (type === "delete") {
      deleteChatFn(id);
    } else {
      const data: {
        id: string;
        status: "archived" | "starred";
      } = {
        id,
        status: type === "archive" ? "archived" : "starred",
      };
      editChatFn(data);
    }
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
            LLM Paglu
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
        <div className="px-4 py-2 flex flex-grow flex-col max-h-[(calc(100% - 252px))] hide-scrollbar overflow-y-auto mb-[100px]">
          <div className="space-y-2">
            {/* Active Chats */}

            {/* Starred Chats Toggle */}
            <div>
              <button
                onClick={() => setIsStarredOpen((prev) => !prev)}
                className="text-xs text-muted-foreground hover:underline mb-1 flex items-center"
              >
                {isStarredOpen ? (
                  <>
                    <ChevronDown className="text-xs" size={16} />
                    Starred Chats
                  </>
                ) : (
                  <>
                    <ChevronRight className="text-xs" size={16} /> Starred Chats
                  </>
                )}
              </button>
              {isStarredOpen &&
                chatHistory
                  .filter((chat) => chat.status === "starred")
                  .map((chat) => (
                    <RenderChatCard
                      chat={chat}
                      activeId={activeId}
                      isLoading={isDeleteChatLoading || isEditLoading}
                      handleEditChat={handleEditChat}
                      makePublicFn={makePublicFn}
                      key={chat.id}
                    />
                  ))}
            </div>

            {/* Archived Chats Toggle */}
            <div>
              <button
                onClick={() => setIsArchivedOpen((prev) => !prev)}
                className="text-xs text-muted-foreground hover:underline mt-2 mb-1 flex items-center"
              >
                {isArchivedOpen ? (
                  <>
                    <ChevronDown className="text-xs" size={16} />
                    Archived Chats
                  </>
                ) : (
                  <>
                    <ChevronRight className="text-xs" size={16} /> Archived
                    Chats
                  </>
                )}
              </button>
              {isArchivedOpen &&
                chatHistory
                  .filter((chat) => chat.status === "archived")
                  .map((chat) => (
                    <RenderChatCard
                      chat={chat}
                      activeId={activeId}
                      isLoading={isDeleteChatLoading || isEditLoading}
                      handleEditChat={handleEditChat}
                      makePublicFn={makePublicFn}
                      key={chat.id}
                    />
                  ))}
            </div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              {chatHistory.length === 0
                ? "Your chats will appear here"
                : "Recent Chats"}
            </h3>
            {chatHistory
              .filter((chat) => chat.status === "active")
              .map((chat) => (
                <RenderChatCard
                  chat={chat}
                  activeId={activeId}
                  isLoading={
                    isDeleteChatLoading ||
                    (isEditLoading && mutateId === chat.id)
                  }
                  handleEditChat={handleEditChat}
                  makePublicFn={makePublicFn}
                  key={chat.id}
                />
              ))}
          </div>
        </div>
        <div className="mt-auto p-4 space-y-2 absolute bottom-0 left-0 bg-background z-20 w-full">
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
