'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Story = {
  id: string;
  content: string;
  promptId: string | null;
  createdAt: string;
  prompt?: { id: string; text: string; slug: string } | null;
  _count?: { comments: number };
};

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setIsAdmin(true);
          return fetch('/api/stories', { credentials: 'include' }).then((r) => r.json());
        }
        setIsAdmin(false);
        return [];
      })
      .then((data) => {
        if (Array.isArray(data)) setStories(data);
      })
      .catch(() => setIsAdmin(false));
  }, []);

  function loadStories() {
    fetch('/api/stories', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setStories(data);
      });
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.ok) {
          setIsAdmin(true);
          loadStories();
        } else {
          setLoginError(data?.error || 'Invalid password');
        }
      })
      .catch(() => setLoginError('Login failed'));
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setIsAdmin(false);
  }

  function deleteStory(id: string) {
    if (!confirm('Delete this story? This cannot be undone.')) return;
    setDeletingId(id);
    fetch(`/api/admin/stories/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (res.ok) {
          setStories((prev) => prev.filter((s) => s.id !== id));
        }
      })
      .finally(() => setDeletingId(null));
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-stone-400">Checking…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-xl font-semibold text-stone-100 mb-4">Admin login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-sm text-stone-400 mb-1">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-stone-800 border border-stone-600 px-3 py-2 text-stone-100 focus:outline-none focus:ring 1px focus:ring-amber-500"
              required
              autoComplete="current-password"
            />
          </div>
          {loginError && <p className="text-sm text-red-400">{loginError}</p>}
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-medium text-sm"
          >
            Log in
          </button>
        </form>
        <p className="mt-6 text-stone-500 text-sm">
          <Link href="/" className="hover:text-stone-400">
            ← Back to feed
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-xl font-semibold text-stone-100">Admin — manage stories</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-stone-400 hover:text-stone-200 border border-stone-600 px-3 py-1.5 rounded-lg hover:bg-stone-800"
          >
            Log out
          </button>
          <Link
            href="/"
            className="text-sm text-stone-400 hover:text-stone-200"
          >
            Back to feed
          </Link>
        </div>
      </div>
      <p className="text-stone-500 text-sm mb-6">
        You can delete any story here. Deleted stories and their comments/reactions are removed permanently.
      </p>
      <ul className="space-y-4">
        {stories.length === 0 ? (
          <li className="text-stone-500 text-sm">No stories.</li>
        ) : (
          stories.map((story) => (
            <li
              key={story.id}
              className="rounded-xl p-4 bg-stone-800/70 border border-stone-700/50 flex flex-col sm:flex-row sm:items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-stone-200 text-sm whitespace-pre-wrap break-words line-clamp-4">
                  {story.content}
                </p>
                <p className="text-stone-500 text-xs mt-2">
                  {new Date(story.createdAt).toLocaleString()}
                  {story._count?.comments != null && ` · ${story._count.comments} comments`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => deleteStory(story.id)}
                disabled={deletingId === story.id}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-red-100 text-sm disabled:opacity-50"
              >
                {deletingId === story.id ? '…' : 'Delete'}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
