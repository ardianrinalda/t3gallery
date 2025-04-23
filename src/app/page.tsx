import Link from "next/link";
import { db } from "../server/db";
import { index } from "drizzle-orm/gel-core";
import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
export const dynamic = "force-dynamic";
export const runtime = 'edge'; // ⬅️ Tell Next.js this page runs in Edge Functions

async function Images(){
  const images = await db.query.images.findMany({
    orderBy: (model, {desc}) => desc(model.id)
  });
  return (
    <div className="flex flex-wrap gap-4">
          {[...images, ...images, ...images, ...images].map((image, index) => (
            <div key={image.id + "-" + index} className="flex w-48 flex-col">
              <img src={image.url} />
              <div>{image.name}</div>
            </div>
          ))}
    </div>
  );
}
export default async function HomePage() {
  
  return (
    <main className="">
      <SignedOut>
        <div className="w-full h-full text-center text-2x1">Please sign in above</div>
      </SignedOut>
      <SignedIn>
        <Images />
      </SignedIn>

    </main>
  );
}
