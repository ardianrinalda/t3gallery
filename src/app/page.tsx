// src/app/page.tsx
export const dynamic = 'force-dynamic';

import { SignedOut, SignedIn } from '@clerk/nextjs';
import { getMyImagesPage }      from '~/server/queries';   // NEW (see below)
import SelectableGallery        from './_components/select-gallery';

export default async function HomePage() {
  // ------- fetch first “page” -------
  const { images, nextCursor } = await getMyImagesPage({
    limit: 20,
    cursor: null,          // first page ⇒ no cursor yet
  });

  return (
    <main>
      <SignedOut>
        <div className="w-full h-full text-center text-2xl">Please sign in above</div>
      </SignedOut>

      <SignedIn>
        <SelectableGallery
          initialImages={images}
          initialNextCursor={nextCursor}   // ✅ real cursor, not null
        />
      </SignedIn>
    </main>
  );
}
