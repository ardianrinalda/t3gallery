'use client';

import React, { useEffect, useState } from 'react';
import Image       from 'next/image';
import Link        from 'next/link';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';   // NEW ✅

type ImageItem = { id: number; url: string; name: string };
type Page      = { images: ImageItem[]; nextCursor: number | null };

export default function SelectableGallery({
  initialImages,
  initialNextCursor,
}: {
  initialImages:     ImageItem[];
  initialNextCursor: number | null;
}) {
  /* ------------------------- state ----------------------------------- */
  const [images,   setImages]   = useState<ImageItem[]>(initialImages);
  const [selected, setSelected] = useState<number[]>([]);
  const [cursor,   setCursor]   = useState<number | null>(initialNextCursor);
  const router = useRouter();

  /* reset when <HomePage/> re-renders (e.g. router.refresh()) */
  useEffect(() => {
    setImages(initialImages);
    setCursor(initialNextCursor);
    setSelected([]);
  }, [initialImages, initialNextCursor]);

  /* ------------------- helpers --------------------------------------- */
  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    await fetch('/api/images/batch-delete', {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ids: selected }),
    });
    setImages((x) => x.filter((img) => !selected.includes(img.id)));
    setSelected([]);
    router.refresh();      // lets the server recompute initialImages/cursor
  };

  /* -------- THE only new bit: fetch next page ------------------------ */
  const loadMore = async () => {
    if (cursor === null) return;
    const res: Page = await fetch(
      `/api/images/page?cursor=${cursor}&limit=20`,
    ).then((r) => r.json());

    setImages((prev) => [...prev, ...res.images]);
    setCursor(res.nextCursor);    // null when no more pages
  };

  /* ------------------------------ UI --------------------------------- */
  return (
    <div className="p-4">
      {selected.length > 0 && (
        <button
          onClick={deleteSelected}
          className="mb-4 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Delete Selected ({selected.length})
        </button>
      )}

      {/* 👇 the InfiniteScroll wrapper does all the work */}
      <InfiniteScroll
        dataLength={images.length}
        next={loadMore}
        hasMore={cursor !== null}
        loader={<p className="mt-4 text-center text-sm text-gray-500">Loading…</p>}
        scrollThreshold="200px"        /* same margin you had before */
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {images.map((image) => (
            <div key={image.id}>
              <div className="relative w-48 pb-[100%]">
                <input
                  type="checkbox"
                  checked={selected.includes(image.id)}
                  onChange={() => toggle(image.id)}
                  className="absolute top-2 left-2 z-10 h-5 w-5 rounded border-2 bg-white"
                />
                <Link href={`/img/${image.id}`} className="absolute inset-0">
                  <Image
                    src={image.url}
                    alt={image.name}
                    fill
                    style={{ objectFit: 'contain' }}
                    className={`rounded transition ${
                      selected.includes(image.id) ? 'ring-4 ring-blue-400' : ''
                    }`}
                  />
                </Link>
              </div>
              <div
                className="mt-1 w-48 truncate text-center text-sm"
                title={image.name}
              >
                {image.name}
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
