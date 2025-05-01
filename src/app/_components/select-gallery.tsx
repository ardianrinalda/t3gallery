'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ImageItem = { id: number; url: string; name: string };

export default function SelectableGallery({
  initialImages,
}: {
  initialImages: ImageItem[];
}) {
  const [images, setImages] = useState<ImageItem[]>(initialImages);
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    setImages(initialImages);
    setSelected([]);
  }, [initialImages]);

  const toggle = (id: number) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );

  const deleteSelected = async () => {
    if (selected.length === 0) return;
    await fetch('/api/images/batch-delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected }),
    });
    setImages(images.filter((img) => !selected.includes(img.id)));
    setSelected([]);
  };

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

      {/* switch from flex-wrap to a proper grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {images.map((image) => (
          <div key={image.id}>
            {/* square wrapper fixes portrait overlap */}
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
            {/* force the same width as the image, and center the name */}
            <div
              className="mt-1 w-48 text-center text-sm truncate"
              title={image.name}
            >
              {image.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
