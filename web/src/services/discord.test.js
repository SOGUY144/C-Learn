import assert from 'node:assert/strict';
import { buildDiscordReportPayload } from './discord.js';

console.log('Testing Discord Webhook Payload Generator...');

const mockState = {
  members: {
    GUY: { id: 'GUY', name: 'GUY', role: 'Captain', streak: 3, completedQuests: { 1: true } },
    FAN: { id: 'FAN', name: 'FAN', role: 'Algorithm', streak: 1, completedQuests: { 1: false } },
    HAN: { id: 'HAN', name: 'HAN', role: 'Speed Coder', streak: 0, completedQuests: {} }
  }
};

const mockGitData = {
  GUY: { files: [{ name: '01-GUY.cpp' }], latestCommit: 'feat: add 01-GUY.cpp' },
  FAN: { files: [], latestCommit: null },
  HAN: { files: [], latestCommit: null }
};

const payload = buildDiscordReportPayload(mockState, mockGitData, 1);

assert.ok(payload.embeds, 'Payload must have embeds');
assert.equal(payload.embeds.length, 1, 'Should have exactly 1 rich embed');

const embed = payload.embeds[0];
assert.ok(embed.title.includes('C-Learn'), 'Title should mention C-Learn');
assert.ok(embed.fields.length >= 3, 'Should have fields for all 3 members');

// GUY should show completed
const guyField = embed.fields.find(f => f.name.includes('GUY'));
assert.ok(guyField, 'Should have GUY field');
assert.ok(guyField.value.includes('Completed'), 'GUY should be marked completed');
assert.ok(guyField.value.includes('3d streak'), 'GUY should show 3d streak');

// FAN should show pending
const fanField = embed.fields.find(f => f.name.includes('FAN'));
assert.ok(fanField, 'Should have FAN field');
assert.ok(fanField.value.includes('Pending'), 'FAN should be marked pending');

console.log('✅ All Discord generator tests passed successfully!');
