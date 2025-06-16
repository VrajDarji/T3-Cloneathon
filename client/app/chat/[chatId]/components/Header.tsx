"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useProfileData } from "@/store";
import { Menu } from "lucide-react";
import React, { SetStateAction, useState } from "react";
import { useShallow } from "zustand/react/shallow";

const models = [
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
];

type Props = {
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
};

const Header = ({ setIsOpen }: Props) => {
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [data] = useProfileData(useShallow((state) => [state.data]));
  const { name } = data;
  return (
    <header className="border-b border-border/50 p-4 flex items-center justify-between glass-effect">
      <div className="flex items-center gap-4">
        <SidebarTrigger onClick={() => setIsOpen((prev) => !prev)}>
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
        <ModeToggle />
        <Avatar>
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium hidden md:flex">{name}</span>
      </div>
    </header>
  );
};

export default Header;
