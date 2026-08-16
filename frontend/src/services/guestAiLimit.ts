import { getStoredToken } from './apiClient';

const GUEST_AI_COUNT_KEY = 'hirex_guest_ai_count';
export const MAX_GUEST_AI_LIMIT = 4;

export interface GuestAiUsageStatus {
  isGuest: boolean;
  used: number;
  limit: number;
  remaining: number;
  canUse: boolean;
}

export const getGuestAiUsage = (): GuestAiUsageStatus => {
  const token = getStoredToken();
  const isGuest = !token;

  if (!isGuest) {
    return {
      isGuest: false,
      used: 0,
      limit: Infinity,
      remaining: Infinity,
      canUse: true,
    };
  }

  let used = 0;
  try {
    const raw = localStorage.getItem(GUEST_AI_COUNT_KEY);
    used = raw ? parseInt(raw, 10) : 0;
    if (isNaN(used) || used < 0) used = 0;
  } catch {
    used = 0;
  }

  const remaining = Math.max(0, MAX_GUEST_AI_LIMIT - used);
  return {
    isGuest: true,
    used,
    limit: MAX_GUEST_AI_LIMIT,
    remaining,
    canUse: used < MAX_GUEST_AI_LIMIT,
  };
};

export const incrementGuestAiUsage = (): GuestAiUsageStatus => {
  const status = getGuestAiUsage();
  if (!status.isGuest) return status;

  const newUsed = status.used + 1;
  try {
    localStorage.setItem(GUEST_AI_COUNT_KEY, newUsed.toString());
  } catch (err) {
    console.warn('Failed to update guest AI count in localStorage:', err);
  }

  // Dispatch event so UI widgets update instantly across components
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('guest_ai_usage_updated', { detail: { used: newUsed } }));
  }

  return getGuestAiUsage();
};

export const resetGuestAiUsage = () => {
  try {
    localStorage.removeItem(GUEST_AI_COUNT_KEY);
  } catch (_err) {
    // Ignore localStorage access errors
  }
};
