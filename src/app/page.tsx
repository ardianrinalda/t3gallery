import Link from "next/link";
import { db } from "../server/db";
import { index } from "drizzle-orm/gel-core";
export const dynamic = "force-dynamic";

const mockUrls = [
  "https://lygpts3ym5.ufs.sh/f/PrQ06h14ANQlb32ehyIaFawBnNVZeTxzACm52slrYG6joEut",
  "https://lygpts3ym5.ufs.sh/f/PrQ06h14ANQlPHZbww4ANQl3b1v5fTUwpLeIWohDyB0KsFck",
  "https://lygpts3ym5.ufs.sh/f/PrQ06h14ANQl8BmAkINluUstNAMp0id5Jrgjvbm4k6QGFVLE",
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default async function HomePage() {
  
  const posts = await db.query.posts.findMany();

  console.log(posts);
  
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {posts.map((post)=> (
          <div key={post.id}>{post.name}</div>
        ))}
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages].map((image) => (
          <div key={image.id + "-" + index} className="w-48">
            <img src={image.url}/>
          </div>
        ))}
      </div>

    </main>
  );
}
