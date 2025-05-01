import "server-only";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, lt } from "drizzle-orm";
import { images } from "./db/schema";
import analyticsServerClient from "./analytics";


export async function getMyImages() {
    const user = await auth();

    if (!user.userId) throw new Error("Unauthorized");
    
    const images = await db.query.images.findMany({
        where: (model, { eq }) => eq(model.userId, user.userId),
        orderBy: (model, {desc}) => desc(model.id)
      });
    return images;
}

export async function getImage(id: number) {
    const user = auth();
    const image = await db.query.images.findFirst({
        where: (model, { eq }) => eq(model.id, id),
    });

    if (!image) throw new Error("Image not found");

    if (image.userId !== (await user).userId) throw new Error("Unauthorized");
    
    return image;
}

export async function deleteImage(id: number) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const image = await db.query.images.findFirst({
        where: (model, { eq }) => eq(model.id, id),
    });
    if (!image) throw new Error("Image not found");

    if (image.userId !== userId) throw new Error("Unauthorized");

    await db
        .delete(images)
        .where(and(eq(images.id, id), eq(images.userId, userId)));


    analyticsServerClient.capture({
        distinctId: userId,
        event: "delete image",
        properties: {
            imageId: id,
        },
    });
}

export async function getMyImagesPage({
    userId,
    limit,
    cursor,
  }: {
    userId: string;
    limit:  number;
    cursor: number | null;
  }) {
    const rows = await db
      .select()
      .from(images)
      .where(and(
        eq(images.userId, userId),          // ← this is the ownership guard
        cursor ? lt(images.id, cursor) : undefined
      ))
      .orderBy(desc(images.id))
      .limit(limit + 1);
  
    const nextCursor = rows.length > limit
      ? rows[limit - 1]!.id
      : null;
  
    return { images: rows.slice(0, limit), nextCursor };
  }
  
  
  
