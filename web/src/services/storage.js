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

/**
 * Load state from localStorage with safe fallback
 */
export function loadState() {
  const defaultState = {
    members: JSON.parse(JSON.stringify(INITIAL_MEMBERS)),
    settings: {
      discordWebhook: '',
      targetContestDate: '2026-09-27T09:00:00',
      firebaseConfig: null
    }
  };

  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultState;
    }
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw);
    return {
      members: {
        ...defaultState.members,
        ...(parsed.members || {})
      },
      settings: {
        ...defaultState.settings,
        ...(parsed.settings || {})
      }
    };
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return defaultState;
  }
}

/**
 * Save state to localStorage and optionally sync to cloud
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
