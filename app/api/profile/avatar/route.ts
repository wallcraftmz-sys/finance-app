import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Необходимо войти в аккаунт" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Выберите фотографию" },
        { status: 400 }
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Разрешены JPG, PNG и WebP" },
        { status: 400 }
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Максимальный размер фотографии — 5 МБ" },
        { status: 400 }
      );
    }

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "moniq/avatars",
            public_id: `user_${user.id}`,
            overwrite: true,
            resource_type: "image",
            transformation: [
              {
                width: 400,
                height: 400,
                crop: "fill",
                gravity: "auto",
              },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error("Ошибка загрузки"));
            } else {
              resolve(result);
            }
          }
        );

        stream.end(buffer);
      }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { avatarUrl: result.secure_url },
    });

    return NextResponse.json({
      ok: true,
      avatarUrl: result.secure_url,
    });
  } catch (error) {
    console.error("AVATAR_UPLOAD_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось загрузить фотографию" },
      { status: 500 }
    );
  }
}
