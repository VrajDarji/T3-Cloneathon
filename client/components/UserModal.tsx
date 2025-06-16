import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal, useProfileData } from "@/store";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useShallow } from "zustand/shallow";
import { Separator } from "./ui/separator";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "@/app/api";
import { useState } from "react";

interface CustomModalProps {
  title: string;
  subheading: string;
  defaultOpen?: boolean;
}

const UserModal: React.FC<CustomModalProps> = ({
  title,
  subheading,
  defaultOpen,
}) => {
  const [isOpen, setClose] = useModal(
    useShallow((state) => [state.isOpen, state.setClose])
  );

  const [user, setUser] = useProfileData(
    useShallow((state) => [state.data, state.setData])
  );

  const [userName, setUserName] = useState<string | null>(user.name);
  const [userPersona, setUserPersona] = useState<string | null>(user.persona);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { id: string; name: string; persona: string }) =>
      updateUser(data),
    onSuccess: (data: any) => {
      const { data: rspData } = data;
      setUser({
        id: rspData.id,
        name: rspData.name,
        persona: rspData.persona,
        email: rspData.email,
      });
      setClose();
    },
    onError: (error: any) => {
      console.log({ error });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      id: user.id,
      name: userName || user.name,
      persona: userPersona || user.persona,
    };
    mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setClose}>
      <DialogContent className="md:max-h-[700px] md:h-fit h-screen bg-card overflow-auto glass-effect">
        <DialogHeader className="py-3 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
        </DialogHeader>
        <Separator />
        <div>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={user.email}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="input"
                  placeholder="John Doe"
                  required
                  value={userName || ""}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="persona">Persona</Label>
                <Input
                  id="persona"
                  type="input"
                  placeholder="chatty,witty..."
                  value={userPersona || ""}
                  onChange={(e) => setUserPersona(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
