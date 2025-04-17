import Link from "next/link";

const mockUrls = [
  "https://lygpts3ym5.ufs.sh/f/PrQ06h14ANQlb32ehyIaFawBnNVZeTxzACm52slrYG6joEut",
  "https://lygpts3ym5.ufs.sh/f/PrQ06h14ANQlPHZbww4ANQl3b1v5fTUwpLeIWohDyB0KsFck",
  "https://lygpts3ym5.ufs.sh/f/PrQ06h14ANQl8BmAkINluUstNAMp0id5Jrgjvbm4k6QGFVLE",
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url,
}));

export default function HomePage() {
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {[...mockImages, ...mockImages, ...mockImages, ...mockImages].map((image) => (
          <div key={image.id} className="w-48">
            <img src={image.url}/>
          </div>
        ))}
      </div>

    </main>
  );
}
