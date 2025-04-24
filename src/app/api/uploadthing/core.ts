import { getAuth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db } from "~/server/db";
import { images } from "~/server/db/schema";

const f = createUploadthing();

/**
 * File-router configuration
 */
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    /**
     * Runs **before** the upload.  
     * If it throws → Upload returns 401 / 500.
     */
    .middleware(async ({ req }) => {
      const { userId } = getAuth(req);
      console.log("🔍  userId seen by uploadthing:", userId);
    
      if (!userId) throw new UploadThingError("Unauthorized");
      return { userId };
    })
    

    /**
     * Runs **after** the file is stored by UploadThing.
     * Good place to persist info in your DB.
     */
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("📥 FILE:", {
        name: file.name,
        size: file.size,
        ufsUrlLen: file.ufsUrl.length,
      });
      console.log("👤 METADATA:", metadata);

      try {
        // ‼️  url column must be text() or varchar( ≥1024 )
        await db.insert(images).values({
          name: file.name,
          url: file.ufsUrl,
        });

        console.log("✅ INSERT OK");
        // Returned object is sent back to the client
        return { uploadedBy: metadata.userId };
      } catch (err) {
        console.error("💥 INSERT FAILED:", err);
        throw new UploadThingError(
          "insert failed: " + (err instanceof Error ? err.message : String(err)),
        );
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
