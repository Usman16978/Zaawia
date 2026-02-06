'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DeletePage() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  function parseInput(value: string): { id: string; token: string } | null {
    const trimmed = value.trim();
    // Full URL: /api/stories/ID?token=TOKEN or origin/api/stories/ID?token=TOKEN
    const urlMatch = trimmed.match(/\/api\/stories\/([a-z0-9]+)\?token=([a-z0-9]+)/i);
    if (urlMatch) return { id: urlMatch[1], token: urlMatch[2] };
    // Two parts: ID and token on separate lines or space
    const parts = trimmed.split(/[\s\n]+/);
    if (parts.length >= 2 && parts[0].length > 5 && parts[1].length > 10) {
      return { id: parts[0], token: parts[1] };
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseInput(input);
    if (!parsed) {
      setMessage('Paste your full delete link, or story ID and token (space-separated).');
      setStatus('error');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch(`/api/stories/${parsed.id}?token=${parsed.token}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus('done');
        setMessage('Your story has been deleted.');
        setInput('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Could not delete. Check your link or token.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong.');
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold text-stone-100">Take my story back</h1>
      <p className="text-neutral-400 mt-1 text-sm">
        Paste the link you got when you published. Your story, your control.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="delete-link" className="block text-sm text-stone-400 mb-1">
            Your story link or ID + token
          </label>
          <textarea
            id="delete-link"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://yoursite.com/api/stories/abc123?token=..."
            rows={3}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring 1px focus:ring-amber-600 resize-y"
          />
        </div>
        {message && (
          <p
            className={`text-sm ${
              status === 'done' ? 'text-green-400' : status === 'error' ? 'text-red-400' : 'text-neutral-400'
            }`}
          >
            {message}
          </p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-100 font-medium text-sm disabled:opacity-50 min-h-[44px] touch-manipulation"
          >
            {status === 'loading' ? 'Taking back…' : 'Take my story back'}
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-lg border border-neutral-600 hover:bg-neutral-800 text-neutral-300 text-sm inline-flex items-center min-h-[44px] touch-manipulation"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
