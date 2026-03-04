import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return Response.json(
        { error: "Credenciais do Cloudinary não configuradas" },
        { status: 500 },
      );
    }

    const session = await auth();

    if (!session?.user?.id) {
      return Response.json({ error: "Não autenticado" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Arquivo inválido" }, { status: 400 });
    }

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      return Response.json({ error: "Formato inválido" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "barberpro/avatars",
            public_id: session.user.id,
            overwrite: true,
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result?.secure_url) {
              reject(error || new Error("Falha ao enviar para Cloudinary"));
              return;
            }
            resolve({ secure_url: result.secure_url });
          },
        );

        stream.end(buffer);
      },
    );

    const imageUrl = uploaded.secure_url;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    return Response.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    return Response.json({ error: "Erro ao enviar arquivo" }, { status: 500 });
  }
}
