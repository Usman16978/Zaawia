'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { STORY_CATEGORIES } from '@/lib/categories';
import { CAROUSEL_IMAGES } from '@/lib/carousel-images';
import { Theme } from 'emoji-picker-react';

const EmojiPicker = dynamic(
  () => import('emoji-picker-react').then((mod) => mod.default),
  { ssr: false }
);

type Prompt = { id: string; text: string; slug: string };

export default function WritePage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [content, setContent] = useState('');
  const [promptId, setPromptId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ id: string; deleteToken: string } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [memoryWallIndex, setMemoryWallIndex] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const storyBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setMemoryWallIndex((i) => (i + 1) % CAROUSEL_IMAGES.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!showEmojiPicker) return;
    function handleClickOutside(e: MouseEvent) {
      if (storyBlockRef.current && !storyBlockRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showEmojiPicker]);

  useEffect(() => {
    fetch('/api/prompts')
      .then((res) => res.json())
      .then((data) => setPrompts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          promptId: promptId || null,
          category: category || null,
        }),
      });
      const data = await res.json();
      if (data.id && data.deleteToken) {
        setDone({ id: data.id, deleteToken: data.deleteToken });
        setContent('');
      } else {
        alert(data?.error || 'Something went wrong.');
      }
    } catch {
      alert('Something went wrong. Check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const deleteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/stories/${done.id}?token=${done.deleteToken}`;
    return (
      <div className="w-full grid grid-cols-1 lg:grid-cols-[min(28rem,100%)_1fr] gap-0 min-h-[60vh]">
        <div className="max-w-md">
          <h1 className="text-xl font-semibold text-neutral-100">Your story is live.</h1>
        <p className="text-neutral-400 mt-2 text-sm">
          Save this link to delete your story later. We don&apos;t store it anywhere else.
        </p>
        <div className="mt-4 flex items-start gap-2">
          <div className="flex-1 min-w-0 p-3 bg-neutral-800 rounded-lg break-all text-xs text-neutral-300">
            {deleteUrl}
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(deleteUrl).then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000);
              });
            }}
            className="shrink-0 p-2.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 border border-stone-600 transition-colors"
            title="Copy link"
            aria-label="Copy delete link"
          >
            {linkCopied ? (
              <span className="text-lg text-green-400" aria-hidden>✓</span>
            ) : (
              <svg className="w-5 h-5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        {linkCopied && <p className="mt-1 text-xs text-green-400">Copied!</p>}
        <p className="mt-2 text-xs text-stone-500">
          Go to Take my story back and paste this link to remove your story anytime.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/delete"
            className="px-4 py-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-100 text-sm"
          >
            Take my story back
          </Link>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm"
          >
            Back to feed
          </Link>
          <button
            type="button"
            onClick={() => setDone(null)}
            className="px-4 py-2 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-sm"
          >
            Write another
          </button>
        </div>
        </div>
        <div className="hidden lg:block relative overflow-hidden min-h-[400px]" aria-hidden>
          <MemoryWall imageIndex={memoryWallIndex} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-[min(28rem,100%)_1fr] gap-0 min-h-[60vh]">
      <div className="max-w-md">
      {/* Safe zone: frosted glass card — "Main yahan mehfooz hoon." */}
      <div className="safe-zone-card rounded-2xl p-4 sm:p-6 md:p-8">
        <h1 className="text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-rose-400">
          Write your story
        </h1>
        <p className="text-stone-200 mt-1 text-sm">
          Jo likha jayega, wo tum se nahi juda jayega. Yahan tumhari kahani mehfooz hai.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm text-stone-400 mb-1">
              Prompt (optional)
            </label>
            <select
              id="prompt"
              value={promptId}
              onChange={(e) => setPromptId(e.target.value)}
              className="w-full bg-stone-900/80 border border-stone-600/50 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:ring 1px focus:ring-stone-500"
            >
              <option value="">Free write</option>
              {prompts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.text}
                </option>
              ))}
            </select>
            <p className="text-xs text-stone-500 mt-1.5">
              Agar samajh nahi aa raha kahan se shuru karein.
            </p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm text-stone-400 mb-1">
              Category (sirf agar tum chaaho)
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-stone-900/80 border border-stone-600/50 rounded-lg px-3 py-2 text-stone-100 focus:outline-none focus:ring 1px focus:ring-stone-500"
            >
              <option value="">None</option>
              {STORY_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div ref={storyBlockRef} className="relative">
            <label htmlFor="content" className="block text-sm text-stone-400 mb-1">
              Your story
            </label>
            <textarea
              ref={contentRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={6}
              maxLength={10000}
              placeholder="Write what you can't say..."
              className="w-full bg-stone-900/80 border border-stone-600/50 rounded-lg px-3 py-2 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring 1px focus:ring-stone-500 resize-y"
            />
            <div className="relative flex items-center flex-wrap gap-2 mt-1">
              <span className="text-xs text-stone-500">
                {content.length >= 200 ? `${content.length.toLocaleString()} / 10,000` : 'Jitna likhna chaho.'}
              </span>
              <span className="text-stone-500 text-xs">Choose emoji</span>
              <button
                type="button"
                onClick={() => setShowEmojiPicker((v) => !v)}
                className="p-1.5 rounded-lg border border-stone-600/50 bg-stone-800/80 text-stone-300 hover:bg-stone-700/80 hover:text-stone-100 transition-colors"
                title="Choose emoji"
                aria-label="Open emoji picker"
              >
                <span className="text-lg leading-none" aria-hidden>😊</span>
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute left-0 top-full mt-2 z-[100] max-w-[min(320px,calc(100vw-2rem)] overflow-x-auto">
                <EmojiPicker
                  onEmojiClick={(emojiData) => {
                    const textarea = contentRef.current;
                    const emoji = emojiData.emoji;
                    if (textarea) {
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const newContent = content.slice(0, start) + emoji + content.slice(end);
                      setContent(newContent);
                      setTimeout(() => {
                        textarea.focus();
                        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
                      }, 0);
                    } else {
                      setContent(content + emoji);
                    }
                  }}
                  theme={Theme.DARK}
                  width={320}
                  height={360}
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-4 py-2.5 bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:pointer-events-none rounded-lg text-sm font-medium text-stone-100 transition-colors min-h-[44px] touch-manipulation"
            >
              {submitting ? 'Publishing…' : 'Publish'}
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 border border-stone-600 hover:bg-stone-800 rounded-lg text-sm inline-flex items-center min-h-[44px] text-stone-300 touch-manipulation"
            >
              Cancel
            </Link>
          </div>
        </form>
        {/* When emoji picker is open, add space so footer stays below and is not covered */}
        {showEmojiPicker && <div className="min-h-[320px] sm:min-h-[380px]" aria-hidden />}
      </div>
      </div>
      {/* Right: memory wall — same images as home, heavy blur + dark overlay, slow fade */}
      <div className="hidden lg:block relative overflow-hidden min-h-[400px]" aria-hidden>
        <MemoryWall imageIndex={memoryWallIndex} />
      </div>
    </div>
  );
}

/** Blurred background images + dark overlay, very slow fade — continuity from home, not distracting. */
function MemoryWall({ imageIndex }: { imageIndex: number }) {
  return (
    <div className="absolute inset-0">
      {CAROUSEL_IMAGES.map((img, i) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity ease-in-out memory-wall-blur memory-wall-transition ${i === imageIndex ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden
        >
          <Image
            src={img.src}
            alt=""
            fill
            className="object-cover"
            sizes="50vw"
            unoptimized
          />
        </div>
      ))}
      <div className="memory-wall-overlay absolute inset-0 z-10" aria-hidden />
    </div>
  );
}
