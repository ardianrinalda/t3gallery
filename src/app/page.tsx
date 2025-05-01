// src/app/page.tsx
export const dynamic    = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { SignedOut, SignedIn } from '@clerk/nextjs';
import { auth }               from '@clerk/nextjs/server';   // ← NEW
import { getMyImagesPage }    from '~/server/queries';
import SelectableGallery      from './_components/select-gallery';

export default async function HomePage() {
  /* ---------- auth ---------- */
  const { userId } = await auth();            // server-side; undefined if signed-out

  /* ---------- first page of images (only if signed-in) ---------- */
  let images:      Awaited<ReturnType<typeof getMyImagesPage>>['images']      = [];
  let nextCursor:  Awaited<ReturnType<typeof getMyImagesPage>>['nextCursor']  = null;

  if (userId) {
    ({ images, nextCursor } = await getMyImagesPage({
      userId,                 // 🔑 scopes query to the owner
      limit:  20,
      cursor: null,
    }));
  }

  /* ---------- render ---------- */
  return (
    <main>
      <SignedOut>
        <div className="w-full h-full text-center text-2xl">
          Please sign in above
        </div>
      </SignedOut>

      <SignedIn>
        <SelectableGallery
          initialImages={images}
          initialNextCursor={nextCursor}
        />
      </SignedIn>
    </main>
  );
}
