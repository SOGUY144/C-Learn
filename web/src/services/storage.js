import { INITIAL_MEMBERS } from '../data/curriculum.js';

const STORAGE_KEY = 'c_learn_team_state_v1';

/**
 * Calculates current streak based on last active date string (YYYY-MM-DD)
 */
export function calculateStreak(lastDateStr, currentDateStr, currentStreak = 0) {
  if (!currentDateStr) {
    currentDateStr = new Date().toISOString().split('T')[0];
  }
  if (!lastDateStr) {
    return 1;
  }

  const dLast = new Date(lastDateStr + 'T00:00:00');
  const dCurr = new Date(currentDateStr + 'T00:00:00');
  const diffTime = dCurr.getTime() - dLast.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return Math.max(1, currentStreak);
  } else if (diffDays === 1) {
    return (currentStreak || 0) + 1;
  } else {
    return 1;
  }
}

/**
 * Pure state reducer for toggling a video
 */
export function toggleVideoInState(state, memberId, videoId) {
  const member = state.members[memberId];
  if (!member) return state;

  const currentStatus = !!member.completedVideos[videoId];
  const updatedMember = {
    ...member,
    completedVideos: {
      ...member.completedVideos,
      [videoId]: !currentStatus
    }
  };

  return {
    ...state,
    members: {
      ...state.members,
      [memberId]: updatedMember
    }
  };
}

/**
 * Pure state reducer for toggling a day quest
 */
export function toggleQuestInState(state, memberId, dayNum, todayStr) {
  const member = state.members[memberId];
  if (!member) return state;

  const currentStatus = !!member.completedQuests[dayNum];
  const newStatus = !currentStatus;
  const today = todayStr || new Date().toISOString().split('T')[0];

  let newStreak = member.streak;
  let newLastActive = member.lastActiveDate;

  if (newStatus) {
    newStreak = calculateStreak(member.lastActiveDate, today, member.streak);
    newLastActive = today;
  }

  const updatedMember = {
    ...member,
    streak: newStreak,
    lastActiveDate: newLastActive,
    completedQuests: {
      ...member.completedQuests,
      [dayNum]: newStatus
    }
  };

  return {
    ...state,
    members: {
      ...state.members,
      [memberId]: updatedMember
    }
  };
}

export const DEFAULT_FIREBASE_URL = 'https://soguy-6b5d8-default-rtdb.asia-southeast1.firebasedatabase.app';

/**
 * Load state from localStorage with safe fallback
 */
export function loadState() {
  const defaultState = {
    members: JSON.parse(JSON.stringify(INITIAL_MEMBERS)),
    settings: {
      discordWebhook: '',
      targetContestDate: '2026-09-27T09:00:00',
      firebaseDatabaseUrl: DEFAULT_FIREBASE_URL
    }
  };

  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultState;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw);
    const savedDbUrl = parsed.settings?.firebaseDatabaseUrl;
    return {
      members: {
        ...defaultState.members,
        ...(parsed.members || {})
      },
      settings: {
        ...defaultState.settings,
        ...(parsed.settings || {}),
        firebaseDatabaseUrl: savedDbUrl || DEFAULT_FIREBASE_URL
      }
    };
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return defaultState;
  }
}

/**
 * Save state to localStorage
 */
export function saveState(state) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
}

/**
 * Normalizes a Firebase Realtime Database URL
 */
export function normalizeFirebaseUrl(url) {
  if (!url) return '';
  let clean = url.trim().replace(/\/$/, '');
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = 'https://' + clean;
  }
  return clean;
}

/**
 * Fetch latest state from Firebase Realtime Database
 */
export async function fetchCloudState(databaseUrl) {
  const url = normalizeFirebaseUrl(databaseUrl);
  if (!url) return null;

  const res = await fetch(`${url}/c_learn_state.json`);
  if (!res.ok) {
    throw new Error(`Cloud fetch failed with HTTP ${res.status}`);
  }
  return await res.json();
}

/**
 * Push local state to Firebase Realtime Database
 */
export async function pushCloudState(databaseUrl, state) {
  const url = normalizeFirebaseUrl(databaseUrl);
  if (!url) return;

  const payload = {
    members: state.members,
    lastUpdated: new Date().toISOString()
  };

  const res = await fetch(`${url}/c_learn_state.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Cloud save failed with HTTP ${res.status}`);
  }
  return await res.json();
}

/**
 * Subscribe to realtime updates from Firebase via Server-Sent Events (SSE)
 */
export function subscribeCloudState(databaseUrl, onData) {
  const url = normalizeFirebaseUrl(databaseUrl);
  if (!url || typeof EventSource === 'undefined') {
    return () => {};
  }

  let eventSource = null;
  try {
    eventSource = new EventSource(`${url}/c_learn_state.json`);

    eventSource.addEventListener('put', (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload && payload.path === '/' && payload.data && payload.data.members) {
          onData(payload.data);
        } else if (payload && payload.path && payload.path.startsWith('/members')) {
          fetchCloudState(databaseUrl).then(data => {
            if (data && data.members) onData(data);
          }).catch(console.warn);
        }
      } catch (err) {
        console.warn('Firebase SSE parse warning:', err);
      }
    });

    eventSource.onerror = (err) => {
      console.warn('Firebase SSE connection issue:', err);
    };
  } catch (err) {
    console.warn('Failed to initialize EventSource:', err);
  }

  return () => {
    if (eventSource) {
      eventSource.close();
    }
  };
}
