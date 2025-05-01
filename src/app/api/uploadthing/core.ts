import { auth, clerkClient, getAuth } from "@clerk/nextjs/server";
import type { RequestLike } from "node_modules/@clerk/nextjs/dist/types/server/types";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";
import { ratelimit } from "~/server/ratelimit";


const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {maxFileSize: "4MB", maxFileCount: 25},
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
        // 👈 pass the request to Clerk
        const request = req as unknown as RequestLike;
        const { userId } = getAuth(req as any);
        const client = await clerkClient();
      
        if (!userId) throw new UploadThingError("Unauthorized");

        const fullUserData = await client.users.getUser(userId);

        if (fullUserData?.privateMetadata?.["can-upload"] !== true)
          throw new UploadThingError("User Does Not Have Upload Permission");

        const { success } = await ratelimit.limit(userId);
        if (!success) throw new UploadThingError("Ratelimited");
        // value available as  metadata.userId  in onUploadComplete
        return { userId };
      })      
    .onUploadComplete(async ({ metadata, file }) => {
    
      try {
        const result = await db.insert(images).values({
          name: file.name,
          url: file.ufsUrl,          // make sure url column is long enough
          userId: metadata.userId!,
        });
        return { uploadedBy: metadata.userId };
      } catch (err) {
        throw new UploadThingError(
          "insert failed: " + (err instanceof Error ? err.message : String(err))
        );
      }
    }),           
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
