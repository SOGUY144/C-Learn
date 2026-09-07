import assert from 'node:assert/strict';
import { calculateStreak, toggleVideoInState, toggleQuestInState } from './storage.js';

console.log('Testing Storage & Streak Logic...');

// 1. Test Streak Calculation
// Same day: streak shouldn't increment twice
const s1 = calculateStreak('2026-09-07', '2026-09-07', 3);
assert.equal(s1, 3, 'Completing on the same day should maintain current streak');

// Consecutive day: streak should increment by 1
const s2 = calculateStreak('2026-09-06', '2026-09-07', 3);
assert.equal(s2, 4, 'Consecutive day completion should increment streak');

// Broken streak (more than 1 day difference): should reset to 1
const s3 = calculateStreak('2026-09-04', '2026-09-07', 5);
assert.equal(s3, 1, 'Missing a day should reset streak to 1');

// First time ever: should start at 1
const s4 = calculateStreak(null, '2026-09-07', 0);
assert.equal(s4, 1, 'First activity should set streak to 1');

// 2. Test toggleVideoInState
const mockState = {
  members: {
    GUY: {
      id: 'GUY',
      streak: 0,
      lastActiveDate: null,
      completedVideos: {},
      completedQuests: {}
    }
  }
};

const stateWithVideo = toggleVideoInState(mockState, 'GUY', 'prog-01');
assert.equal(stateWithVideo.members.GUY.completedVideos['prog-01'], true, 'Video should be marked true');

const stateWithoutVideo = toggleVideoInState(stateWithVideo, 'GUY', 'prog-01');
assert.equal(stateWithoutVideo.members.GUY.completedVideos['prog-01'], false, 'Video should be toggled to false');

// 3. Test toggleQuestInState
const stateWithQuest = toggleQuestInState(mockState, 'GUY', 1, '2026-09-07');
assert.equal(stateWithQuest.members.GUY.completedQuests[1], true, 'Quest 1 should be marked true');
assert.equal(stateWithQuest.members.GUY.streak, 1, 'Streak should be 1 after first completion');
// 4. Test normalizeFirebaseUrl
import { normalizeFirebaseUrl } from './storage.js';
assert.equal(normalizeFirebaseUrl('https://my-app.firebaseio.com/'), 'https://my-app.firebaseio.com');
assert.equal(normalizeFirebaseUrl('my-app.firebaseio.com'), 'https://my-app.firebaseio.com');
assert.equal(normalizeFirebaseUrl(''), '');

console.log('✅ All Storage & Streak tests passed successfully!');
