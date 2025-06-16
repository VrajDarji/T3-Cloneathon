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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CustomModalProps {
  title: string;
  subheading: string;
  defaultOpen?: boolean;
  publicId: string;
}

const PublicModal: React.FC<CustomModalProps> = ({
  title,
  subheading,
  defaultOpen,
  publicId,
}) => {
  const [isOpen, setClose] = useModal(
    useShallow((state) => [state.isOpen, state.setClose])
  );

  const router = useRouter();
  const publicURL = `${window.location.origin}/public/${publicId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicURL);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleVisit = () => {
    router.push(`/public/${publicId}`);
    setClose();
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
            <Label>One-Time Public Link</Label>
            <Input disabled value={publicURL} />
          </CardContent>
          <CardContent className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopy}>
              Copy Link
            </Button>
            <Button onClick={handleVisit}>Go to Chat</Button>
          </CardContent>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublicModal;
