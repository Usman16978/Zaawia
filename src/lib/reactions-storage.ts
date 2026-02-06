const STORAGE_KEY = 'zaawiya_reactions';

export type ReactionType = 'LIKE' | 'MERE_SATH_BIHI';

/** Stored shape: { [storyId]: { LIKE?: string, MERE_SATH_BIHI?: string } } — token per reaction for toggle (unlike). */
function getStored(): Record<string, Partial<Record<ReactionType, string>>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function setStored(data: Record<string, Partial<Record<ReactionType, string>>>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function getMyReactionToken(storyId: string, type: ReactionType): string | null {
  const all = getStored();
  const tokens = all[storyId];
  return tokens?.[type] ?? null;
}

export function saveMyReaction(storyId: string, type: ReactionType, clientToken: string) {
  if (typeof window === 'undefined') return;
  try {
    const all = getStored();
    const current = all[storyId] ?? {};
    all[storyId] = { ...current, [type]: clientToken };
    setStored(all);
  } catch {
    // ignore
  }
}

export function removeMyReaction(storyId: string, type: ReactionType) {
  if (typeof window === 'undefined') return;
  try {
    const all = getStored();
    const current = all[storyId] ?? {};
    const next = { ...current };
    delete next[type];
    if (Object.keys(next).length === 0) {
      const rest = { ...all };
      delete rest[storyId];
      setStored(rest);
    } else {
      all[storyId] = next;
      setStored(all);
    }
  } catch {
    // ignore
  }
}

export function getMyReactions(storyId: string): ReactionType[] {
  const all = getStored();
  const tokens = all[storyId];
  if (!tokens) return [];
  return (['LIKE', 'MERE_SATH_BIHI'] as const).filter((t) => tokens[t]);
}

export function hasLiked(storyId: string): boolean {
  return getMyReactionToken(storyId, 'LIKE') != null;
}

export function hasMereSathBhi(storyId: string): boolean {
  return getMyReactionToken(storyId, 'MERE_SATH_BIHI') != null;
}
