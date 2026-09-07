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

  const completedVideos = member.completedVideos || {};
  const currentStatus = !!completedVideos[videoId];
  const updatedMember = {
    ...member,
    completedVideos: {
      ...completedVideos,
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

  const completedQuests = member.completedQuests || {};
  const currentStatus = !!completedQuests[dayNum];
  const newStatus = !currentStatus;
  const today = todayStr || new Date().toISOString().split('T')[0];

  let newStreak = member.streak || 0;
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
      ...completedQuests,
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
 * Normalizes member data ensuring completedQuests and completedVideos are safe dictionaries
 */
export function sanitizeState(rawState) {
  if (!rawState) return null;
  const rawMembers = rawState.members || {};
  const members = {};

  ['GUY', 'FAN', 'HAN'].forEach(key => {
    const m = rawMembers[key] || {};
    
    // Normalize completedQuests whether it is an Array from Firebase or an Object
    const rawQuests = m.completedQuests || {};
    const completedQuests = {};
    if (Array.isArray(rawQuests)) {
      rawQuests.forEach((val, idx) => {
        if (val) completedQuests[idx] = true;
      });
    } else if (typeof rawQuests === 'object') {
      Object.keys(rawQuests).forEach(k => {
        if (rawQuests[k]) completedQuests[k] = true;
      });
    }

    // Normalize completedVideos
    const rawVideos = m.completedVideos || {};
    const completedVideos = {};
    if (typeof rawVideos === 'object') {
      Object.keys(rawVideos).forEach(k => {
        if (k !== 'init' && rawVideos[k]) completedVideos[k] = true;
      });
    }

    members[key] = {
      id: m.id || key,
      name: m.name || key,
      streak: Number(m.streak) || 0,
      lastActiveDate: m.lastActiveDate || null,
      completedVideos,
      completedQuests
    };
  });

  return {
    ...rawState,
    members,
    settings: {
      discordWebhook: rawState.settings?.discordWebhook || '',
      targetContestDate: rawState.settings?.targetContestDate || '2026-09-27T09:00:00',
      firebaseDatabaseUrl: rawState.settings?.firebaseDatabaseUrl || DEFAULT_FIREBASE_URL
    }
  };
}

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
    const combined = {
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
    return sanitizeState(combined) || defaultState;
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
  const data = await res.json();
  return sanitizeState(data);
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
          const sanitized = sanitizeState(payload.data);
          if (sanitized) onData(sanitized);
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
