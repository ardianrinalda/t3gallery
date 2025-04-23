import Link from "next/link";
import { db } from "../server/db";
import { index } from "drizzle-orm/gel-core";
export const dynamic = "force-dynamic";


export default async function HomePage() {
  
  const images = await db.query.images.findMany({
    orderBy: (model, {desc}) => desc(model.id)
  });
  
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {[...images, ...images, ...images, ...images].map((image, index) => (
          <div key={image.id + "-" + index} className="flex w-48 flex-col">
            <img src={image.url} />
            <div>{image.name}</div>
          </div>
        ))}
      </div>

    </main>
  );
}

export function Home() {
  try {
    return <main>Hello T3Gallery</main>;
  } catch (err) {
    console.error("SSR crash:", err);
    return <main>Something went wrong</main>;
  }
}
