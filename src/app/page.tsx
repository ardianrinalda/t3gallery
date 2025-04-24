import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { getMyImages } from "~/server/queries";
export const dynamic = "force-dynamic";
export const runtime = 'edge'; // ⬅️ Tell Next.js this page runs in Edge Functions

async function Images(){
  const images = await getMyImages();

  return (
    <div className="flex flex-wrap gap-4">
          {images.map((image) => (
            <div key={image.id} className="flex w-48 flex-col">
              <img src={image.url} alt={image.name} className="rounded w-48" />
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

