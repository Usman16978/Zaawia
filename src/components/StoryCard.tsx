'use client';

import { useState, useEffect } from 'react';
import { saveMyReaction, removeMyReaction, getMyReactionToken, hasLiked, hasMereSathBhi } from '@/lib/reactions-storage';

type Prompt = { id: string; text: string; slug: string };
type Story = {
  id: string;
  content: string;
  promptId: string | null;
  createdAt: string;
  prompt?: Prompt | null;
  _count?: { comments: number };
};
type Comment = { id: string; content: string; createdAt: string };

export function StoryCard({
  story,
  onFilterByPrompt,
  activeFilter,
}: {
  story: Story;
  onFilterByPrompt: (promptId: string | null) => void;
  activeFilter: string | null;
}) {
  const [reactions, setReactions] = useState({ like: 0, mereSathBhi: 0 });
  const [userLiked, setUserLiked] = useState(false);
  const [userMereSathBhi, setUserMereSathBhi] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportDone, setReportDone] = useState(false);

  function loadReactions() {
    fetch(`/api/stories/${story.id}/reactions`)
      .then((res) => res.json())
      .then((data) => setReactions({ like: data.like ?? 0, mereSathBhi: data.mereSathBhi ?? 0 }))
      .catch(() => {});
  }

  function loadComments() {
    fetch(`/api/stories/${story.id}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setComments(data);
        else setComments([]);
        setCommentsLoaded(true);
      })
      .catch(() => {
        setComments([]);
        setCommentsLoaded(true);
      });
  }

  useEffect(() => {
    loadReactions();
    setUserLiked(hasLiked(story.id));
    setUserMereSathBhi(hasMereSathBhi(story.id));
  }, [story.id]);

  useEffect(() => {
    if (showComments) loadComments();
  }, [showComments, story.id]);

  function toggleReaction(type: 'LIKE' | 'MERE_SATH_BIHI') {
    const token = getMyReactionToken(story.id, type);
    const isActive = type === 'LIKE' ? userLiked : userMereSathBhi;
    if (isActive && token) {
      fetch(`/api/stories/${story.id}/reactions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, clientToken: token }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) return;
          setReactions({ like: data.like ?? 0, mereSathBhi: data.mereSathBhi ?? 0 });
          removeMyReaction(story.id, type);
          if (type === 'LIKE') setUserLiked(false);
          if (type === 'MERE_SATH_BIHI') setUserMereSathBhi(false);
        })
        .catch(() => {});
      return;
    }
    const clientToken = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `t${Date.now()}-${Math.random().toString(36).slice(2)}`;
    fetch(`/api/stories/${story.id}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, clientToken }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) return;
        setReactions({ like: data.like ?? 0, mereSathBhi: data.mereSathBhi ?? 0 });
        saveMyReaction(story.id, type, clientToken);
        if (type === 'LIKE') setUserLiked(true);
        if (type === 'MERE_SATH_BIHI') setUserMereSathBhi(true);
      })
      .catch(() => {});
  }

  function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmittingComment(true);
    fetch(`/api/stories/${story.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newComment.trim() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.id) {
          setNewComment('');
          loadComments();
        }
      })
      .finally(() => setSubmittingComment(false));
  }

  function reportStory() {
    if (reportDone) return;
    setReporting(true);
    fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storyId: story.id }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setReportDone(true);
      })
      .finally(() => setReporting(false));
  }

  return (
    <article className="rounded-xl p-4 bg-stone-800/70 border border-stone-700/50 shadow-xl shadow-black/20 backdrop-blur-sm">
      {story.prompt && (
        <button
          type="button"
          onClick={() => onFilterByPrompt(activeFilter === story.promptId ? null : story.promptId ?? null)}
          className="text-xs text-stone-500 font-medium uppercase tracking-wider hover:text-amber-500/80 transition-colors"
          title="More from this prompt"
        >
          {story.prompt.text}
        </button>
      )}
      <p className="story-content mt-2 text-stone-200 whitespace-pre-wrap break-words">{story.content}</p>
      <time
        dateTime={story.createdAt}
        className="block mt-2 text-stone-500 text-xs"
      >
        {new Date(story.createdAt).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </time>

      {/* Actions — wrap on mobile, touch-friendly */}
      <div className="mt-4 pt-3 border-t border-stone-700 flex flex-wrap items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => toggleReaction('LIKE')}
            className={`flex items-center gap-1.5 text-sm transition-colors min-h-[44px] px-2 py-1.5 -mx-2 -my-1.5 rounded-lg touch-manipulation ${userLiked ? 'text-amber-500' : 'text-stone-400 hover:text-amber-500/90'}`}
          >
            <span aria-hidden>{userLiked ? '👍' : '👍'}</span>
            <span>{reactions.like}</span>
          </button>
          <button
            type="button"
            onClick={() => toggleReaction('MERE_SATH_BIHI')}
            className={`flex items-center gap-1.5 text-sm transition-colors min-h-[44px] px-2 py-1.5 -mx-2 -my-1.5 rounded-lg touch-manipulation ${userMereSathBhi ? 'text-amber-500' : 'text-stone-400 hover:text-amber-500/90'}`}
          >
            <span aria-hidden>{userMereSathBhi ? '🤝' : '🤝'}</span>
            <span className="hidden sm:inline">Mere sath bhi</span>
            <span className="text-stone-500">({reactions.mereSathBhi})</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="text-stone-400 hover:text-amber-500/90 text-sm transition-colors min-h-[44px] inline-flex items-center px-2 py-1.5 -mx-2 -my-1.5 rounded-lg touch-manipulation"
        >
          {showComments ? 'Hide' : 'Comments'} ({commentsLoaded ? comments.length : (story._count?.comments ?? 0)})
        </button>
        <button
          type="button"
          onClick={reportStory}
          disabled={reporting || reportDone}
          className="text-stone-500 hover:text-red-400/90 text-xs transition-colors disabled:opacity-50 ml-auto min-h-[44px] inline-flex items-center px-2 py-1.5 -mx-2 -my-1.5 rounded-lg touch-manipulation"
        >
          {reportDone ? 'Reported' : reporting ? '…' : 'Report'}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-stone-700 space-y-3">
          <p className="text-xs text-stone-500 font-medium uppercase">Comments</p>
          {comments.length === 0 ? (
            <p className="text-stone-500 text-sm">No comments yet.</p>
          ) : (
            <ul className="space-y-2">
              {comments.map((c) => (
                <li key={c.id} className="story-content text-sm text-stone-300 pl-2 border-l-2 border-stone-600">
                  {c.content}
                  <time className="block text-xs text-stone-500 mt-0.5">
                    {new Date(c.createdAt).toLocaleString()}
                  </time>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={submitComment} className="flex flex-col gap-2 sm:flex-row sm:gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment (anonymous)"
              maxLength={500}
              className="flex-1 min-w-0 bg-stone-800 border border-stone-600 rounded-lg px-3 py-2.5 text-stone-100 placeholder-stone-500 text-sm focus:outline-none focus:ring 1px focus:ring-amber-600 min-h-[44px]"
            />
            <button
              type="submit"
              disabled={submittingComment || !newComment.trim()}
              className="px-3 py-2.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-sm disabled:opacity-50 min-h-[44px] shrink-0 touch-manipulation"
            >
              {submittingComment ? '…' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
