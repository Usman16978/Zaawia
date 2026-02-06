'use client';

import Image from 'next/image';
import Link from 'next/link';

const HERO_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80',
    alt: 'Write your story',
    caption: 'Write',
  },
  {
    src: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80',
    alt: 'Speak from the heart',
    caption: 'Dil ki baat',
  },
  {
    src: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80',
    alt: 'Your story matters',
    caption: 'Your story',
  },
  {
    src: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80',
    alt: 'Share without fear',
    caption: 'Anonymous',
  },
];

export function HeroImages() {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-stone-100 mb-2">
        Write what you want to say
      </h2>
      <p className="text-stone-400 text-sm mb-6">
        No name, no face. Just the story. Yahan kahani reh jaati hai, banda gaayab.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {HERO_IMAGES.map((img, i) => (
          <Link
            key={i}
            href="/write"
            className="group relative block rounded-xl overflow-hidden border border-stone-700/50 bg-stone-800/50 shadow-lg shadow-black/20 hover:shadow-amber-900/20 hover:border-amber-700/40 transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="aspect-[16/9] relative">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <span className="absolute bottom-2 left-2 right-2 text-sm font-medium text-stone-200 group-hover:text-amber-200 transition-colors">
                {img.caption}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
