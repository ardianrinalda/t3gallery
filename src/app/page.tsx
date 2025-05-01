import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { getMyImages } from "~/server/queries";
import Image from "next/image";
import Link from "next/link";
import SelectableGallery from "./_components/select-gallery";
export const dynamic = "force-dynamic";


async function Images(){
  const images = await getMyImages();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {images.map((image) => (
            <div key={image.id} className="mb-4 flex flex-col items-center">
              <Link href={`/img/${image.id}`}>
              {/* square wrapper */}
                <div className="relative w-full pb-[100%]">
                  <Image
                    src={image.url} 
                    alt={image.name}
                    fill
                    style={{objectFit:"contain"}} />
                </div>
              </Link>
              <div
                className="mt-1 w-full text-center text-sm truncate centered"
                title={image.name}
              >
                {image.name}
              </div>
            </div>
          ))}
    </div>
  );
}
export default async function HomePage() {
  const images = await getMyImages();
  
  return (
    <main className="">
      <SignedOut>
        <div className="w-full h-full text-center text-2x1">Please sign in above</div>
      </SignedOut>
      <SignedIn>
        <SelectableGallery initialImages={images} />
      </SignedIn>

    </main>
  );
}

