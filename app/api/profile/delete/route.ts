import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcrypt";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Необходимо войти в аккаунт" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const password = body.password;
    const confirmation = body.confirmation;

    if (
      typeof password !== "string" ||
      confirmation !== "УДАЛИТЬ"
    ) {
      return NextResponse.json(
        { error: "Введите пароль и слово УДАЛИТЬ" },
        { status: 400 }
      );
    }

    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        passwordHash: true,
        avatarUrl: true,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Аккаунт не найден" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      account.passwordHash
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Неверный пароль" },
        { status: 400 }
      );
    }

    if (account.avatarUrl) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
        api_key: process.env.CLOUDINARY_API_KEY?.trim(),
        api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
        secure: true,
      });

      const publicId = `moniq/avatars/user_${account.id}`;

      try {
        const result = await cloudinary.uploader.destroy(
          publicId,
          {
            resource_type: "image",
            invalidate: true,
          }
        );

        if (
          result.result !== "ok" &&
          result.result !== "not found"
        ) {
          throw new Error("Cloudinary deletion failed");
        }
      } catch (error) {
        console.error("AVATAR_DELETE_ERROR", error);

        return NextResponse.json(
          {
            error:
              "Не удалось удалить фотографию. Аккаунт пока не удалён. Попробуйте позже.",
          },
          { status: 503 }
        );
      }
    }

    await prisma.user.delete({
      where: { id: account.id },
    });

    const cookieStore = await cookies();

    cookieStore.delete("finance_session");

    return NextResponse.json({
      ok: true,
      message: "Аккаунт удалён",
    });
  } catch (error) {
    console.error("ACCOUNT_DELETE_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось удалить аккаунт" },
      { status: 500 }
    );
  }
}
