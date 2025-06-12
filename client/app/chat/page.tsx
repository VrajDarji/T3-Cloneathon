"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Send,
  Bot,
  User,
  Menu,
  Plus,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
];

const chatHistory = [
  { id: "1", title: "React Best Practices", timestamp: "2 hours ago" },
  { id: "2", title: "API Design Patterns", timestamp: "1 day ago" },
  { id: "3", title: "Database Optimization", timestamp: "3 days ago" },
];

export default function ChatPage() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-row  bg-gradient-to-br from-background via-background to-muted/30 relative">
        {/* Sidebar */}

        <Sidebar className="border-r relative">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                MultiLLM Chat
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <div className="p-4">
              <Button
                className="w-full justify-start gap-2 gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                variant="outline"
              >
                <Plus className="w-4 h-4" />
                New Chat
              </Button>
            </div>
            <Separator />
            <div className="p-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Recent Chats
              </h3>
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <Card
                    key={chat.id}
                    className="p-3 cursor-pointer hover-lift border-0 glass-effect transition-all duration-200"
                  >
                    <div className="text-sm font-medium truncate">
                      {chat.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {chat.timestamp}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="mt-auto p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Header */}
          <header className="border-b border-border/50 p-4 flex items-center justify-between glass-effect">
            <div className="flex items-center gap-4">
              <SidebarTrigger
                onClick={() => setIsSidebarVisible((prev) => !prev)}
              >
                <Button variant="ghost" size="icon">
                  <Menu className="w-4 h-4" />
                </Button>
              </SidebarTrigger>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-64 glass-effect border-0 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-effect border-0">
                  {models.map((model) => (
                    <SelectItem
                      key={model.id}
                      value={model.id}
                      className="hover:bg-primary/10"
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{model.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {model.provider}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">John Doe</span>
            </div>
          </header>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Start a conversation
                  </h3>
                  <p className="text-muted-foreground">
                    Choose a model and start chatting with AI assistants
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <Card
                      className={`max-w-[80%] p-4 transition-all duration-200 ${
                        message.role === "user"
                          ? "gradient-primary text-white shadow-lg message-glow"
                          : "glass-effect border-0 shadow-md hover:shadow-lg"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.parts.map((part, i) => {
                          if (part.type === "text") {
                            return <span key={i}>{part.text}</span>;
                          }
                          return null;
                        })}
                      </div>
                    </Card>
                    {message.role === "user" && (
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
              )} */}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border/50 p-4 glass-effect">
            <form onSubmit={() => {}} className="max-w-4xl mx-auto">
              <div className="flex gap-2">
                <Input
                  value={""}
                  onChange={() => {}}
                  placeholder="Type your message..."
                  className="flex-1 glass-effect border-0 shadow-sm focus:shadow-md transition-all duration-200"
                  disabled={false}
                />
                <Button
                  type="submit"
                  disabled={false}
                  className="gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
