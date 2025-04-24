import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { getMyImages } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";
export const runtime = 'edge'; // ⬅️ Tell Next.js this page runs in Edge Functions

async function Images(){
  const images = await getMyImages();

  return (
    <div className="flex flex-wrap justify-center gap-4">
          {images.map((image) => (
            <div key={image.id} className="flex h-48 w-48 flex-col">
              <Link href={`/img/${image.id}`}>
              <Image
                src={image.url} 
                style={{objectFit:"contain"}} 
                width={192}
                height={192}
                alt={image.name} />
              </Link>
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

