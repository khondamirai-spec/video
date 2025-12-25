import Image from "next/image";
import Link from "next/link";

const videos = [
  {
    id: "6666666666666666666666666666",
    thumbnail: "/1.png",
    title: "USTOZ AI",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm px-4 py-3">
      </header>

      {/* Video Grid */}
      <main className="px-2 pb-8">
        <div className="grid grid-cols-2 gap-2">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="video-card group relative aspect-[9/16] overflow-hidden rounded-xl bg-zinc-900"
            >
              {/* Thumbnail */}
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />

              {/* Play Icon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                  <svg
                    className="h-7 w-7 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
