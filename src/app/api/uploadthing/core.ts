import { auth, getAuth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";


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
        const { userId } = getAuth(req);
      
        if (!userId) throw new UploadThingError("Unauthorized");
      
        // value available as  metadata.userId  in onUploadComplete
        return { userId };
      })      
    .onUploadComplete(async ({ metadata, file }) => {
    
      try {
        const result = await db.insert(images).values({
          name: file.name,
          url: file.ufsUrl,          // make sure url column is long enough
          userId: metadata.userId,
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
