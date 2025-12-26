"use client";

import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ButtonCopyLinkProps {
  userId: string;
}

export function ButtonCopyLink({ userId }: ButtonCopyLinkProps) {
  async function handleCopyLink() {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/barber/${userId}`
    );
    toast.success("Link copiado para a área de transferência!");
  }

  return (
    <Button
      onClick={handleCopyLink}
      className="bg-barber-primary-light cursor-pointer hover:bg-barber-gold hover:brightness-110 hover:scale-[1.02] transition-all hover:shadow-md hover:shadow-barber-gold/30 hover:text-black"
      title="Copiar Link"
    >
      <LinkIcon className="h-5 w-5" />
    </Button>
  );
}
