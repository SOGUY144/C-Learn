import assert from 'node:assert/strict';
import { parseGitHubContents, parseGitHubCommits } from './github.js';

console.log('Testing GitHub API Response Parsers...');

// 1. Test parseGitHubContents
const mockContents = [
  { name: '.gitkeep', type: 'file', size: 6, download_url: 'https://example.com/.gitkeep' },
  { name: '01-GUY.cpp', type: 'file', size: 1231, download_url: 'https://example.com/01-GUY.cpp' },
  { name: '01-GUY.exe', type: 'file', size: 1411584, download_url: null },
  { name: '02-loops.cpp', type: 'file', size: 850, download_url: 'https://example.com/02-loops.cpp' }
];

const parsedFiles = parseGitHubContents(mockContents);
assert.equal(parsedFiles.length, 2, 'Should only return .cpp source files and exclude .gitkeep / executables');
assert.equal(parsedFiles[0].name, '01-GUY.cpp');
assert.equal(parsedFiles[1].name, '02-loops.cpp');

// 2. Test parseGitHubCommits
const mockCommits = [
  {
    sha: 'abcdef1234567890',
    commit: {
      message: 'feat: add 01-GUY.cpp solution',
      author: {
        name: 'GUY',
        date: '2026-09-07T12:00:00Z'
      }
    }
  }
];

const parsedCommits = parseGitHubCommits(mockCommits);
assert.equal(parsedCommits.length, 1);
assert.equal(parsedCommits[0].shortSha, 'abcdef1');
assert.equal(parsedCommits[0].message, 'feat: add 01-GUY.cpp solution');
assert.equal(parsedCommits[0].author, 'GUY');

console.log('✅ All GitHub parser tests passed successfully!');
