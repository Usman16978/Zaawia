import { ImageCarousel } from '@/components/ImageCarousel';
import { StoriesSection } from '@/components/StoriesSection';

export default function HomePage() {
  return (
    <>
      <section className="mb-10">
        <ImageCarousel />
      </section>

      {/* What we offer: 4 cards with glow */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold text-stone-100 mb-3">What we offer</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="animate-card-glow rounded-xl bg-stone-800/70 border border-stone-600/50 py-5 px-4 text-center">
            <span className="block text-amber-400/90 font-semibold text-sm mb-1">Privacy</span>
            <p className="text-stone-300 text-xs">Your story stays yours. We never share it.</p>
          </div>
          <div className="animate-card-glow rounded-xl bg-stone-800/70 border border-stone-600/50 py-5 px-4 text-center">
            <span className="block text-amber-400/90 font-semibold text-sm mb-1">Anonymous</span>
            <p className="text-stone-300 text-xs">No name, no face. Just the story.</p>
          </div>
          <div className="animate-card-glow rounded-xl bg-stone-800/70 border border-stone-600/50 py-5 px-4 text-center">
            <span className="block text-amber-400/90 font-semibold text-sm mb-1">Identity safe</span>
            <p className="text-stone-300 text-xs">We never share your identity. Write without fear.</p>
          </div>
          <div className="animate-card-glow rounded-xl bg-stone-800/70 border border-stone-600/50 py-5 px-4 text-center">
            <span className="block text-amber-400/90 font-semibold text-sm mb-1">Your control</span>
            <p className="text-stone-300 text-xs">Take your story back anytime with your link.</p>
          </div>
        </div>
      </section>

      {/* Stories: title + categories left, body centered */}
      <StoriesSection />
    </>
  );
}
