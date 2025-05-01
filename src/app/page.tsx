export const dynamic = "force-dynamic";
import { SignedOut } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { getMyImages } from "~/server/queries";
import SelectableGallery from "./_components/select-gallery";


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

