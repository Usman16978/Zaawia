export const STORY_CATEGORIES = [
  { value: 'SAD', label: 'Sad' },
  { value: 'ROMANTIC', label: 'Romantic' },
  { value: 'ANGER', label: 'Anger' },
  { value: 'HOPE', label: 'Hope' },
  { value: 'FEAR', label: 'Fear' },
  { value: 'LONELY', label: 'Lonely' },
  { value: 'FAMILY', label: 'Family' },
  { value: 'FRIENDSHIP', label: 'Friendship' },
] as const;

export type CategoryValue = (typeof STORY_CATEGORIES)[number]['value'];
