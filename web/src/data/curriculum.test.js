import assert from 'node:assert/strict';
import { DAYS_ROADMAP, ALL_PLAYLIST_VIDEOS, INITIAL_MEMBERS } from './curriculum.js';

console.log('Testing Curriculum Data Integrity...');

// 1. Verify 20 Days Roadmap
assert.equal(Array.isArray(DAYS_ROADMAP), true, 'DAYS_ROADMAP should be an array');
assert.equal(DAYS_ROADMAP.length, 20, 'Should have exactly 20 days in the roadmap');

DAYS_ROADMAP.forEach((day, index) => {
  assert.equal(day.day, index + 1, `Day number should match index + 1 (day ${day.day})`);
  assert.ok(day.title && day.title.length > 0, `Day ${day.day} must have a title`);
  assert.ok(day.phase && day.phase.length > 0, `Day ${day.day} must have a phase`);
  assert.ok(Array.isArray(day.videos), `Day ${day.day} videos must be an array`);
  assert.ok(day.videos.length > 0, `Day ${day.day} must have at least one video`);
  assert.ok(day.challenge && day.challenge.filename, `Day ${day.day} must have a target challenge filename`);
});

// 2. Verify Initial Members
assert.ok(INITIAL_MEMBERS.GUY, 'Should contain GUY');
assert.ok(INITIAL_MEMBERS.FAN, 'Should contain FAN');
assert.ok(INITIAL_MEMBERS.HAN, 'Should contain HAN');

['GUY', 'FAN', 'HAN'].forEach(id => {
  const member = INITIAL_MEMBERS[id];
  assert.equal(member.id, id);
  assert.ok(member.name);
  assert.equal(typeof member.streak, 'number');
  assert.ok(typeof member.completedVideos === 'object');
  assert.ok(typeof member.completedQuests === 'object');
});

// 3. Verify ALL_PLAYLIST_VIDEOS
assert.ok(Array.isArray(ALL_PLAYLIST_VIDEOS), 'ALL_PLAYLIST_VIDEOS should be an array');
assert.ok(ALL_PLAYLIST_VIDEOS.length >= 30, 'Should have at least all 30 videos from Computer Programming');

console.log('✅ All Curriculum tests passed successfully!');
