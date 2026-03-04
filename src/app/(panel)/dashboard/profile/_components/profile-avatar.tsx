"use client";

interface AvatarProfileProps {
  avatarUrl: string | null;
  userId: string;
}

import { Loader, Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import imageAvatar from "../../../../../../public/foto1.jpg";
import { toast } from "sonner";

export function AvatarProfile({ avatarUrl, userId }: AvatarProfileProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(avatarUrl);
  const [loading, setLoading] = useState(false);

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const image = event.target.files?.[0];

    if (image?.type !== "image/jpeg" && image?.type !== "image/png") {
      toast.error("Apenas arquivos JPEG ou PNG são permitidos.");
      setLoading(false);
      return;
    }
    const neweFileName = `${userId}`;
    const newFile = new File([image], neweFileName, { type: image.type });

    const urlImage = await uploadImage(newFile);
    if (urlImage) {
      setPreviewImage(urlImage);
    }
  }

  async function uploadImage(file: File) {
    try {
     
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await fetch("/api/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Falha no upload");
      }

      toast.success("Imagem enviada com sucesso!");
      return data.imageUrl as string;
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erro ao enviar a imagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-40 h-40 md:w-45 md:h-45 rounded-full overflow-hidden  border-2 border-barber-gold/40">
      <div className="relative flex items-center justify-center w-full h-full bg-red-700">
        <span className="absolute  bg-slate-50/20 p-2 rounded-full cursor-pointer z-20">
          {loading ? (
            <Loader size={20} className="text-gray-800 animate-spin" />
          ) : (
            <Upload size={20} className="text-gray-800" />
          )}
        </span>
        <input
          type="file"
          className="cursor-pointer relative z-50 w-48 h-48 opacity-0"
          onChange={handleChange}
        />
      </div>

      {previewImage ? (
        <Image
          src={previewImage}
          alt="Imagem de perfil"
          fill
          quality={100}
          priority
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw"
          className="w-full h-full object-cover"
        />
      ) : (
        <Image
          src={imageAvatar}
          alt="Imagem de perfil"
          fill
          quality={100}
          priority
          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}
