export const REPO_OWNER = 'SOGUY144';
export const REPO_NAME = 'C-Learn';

// In-memory cache to avoid hitting GitHub unauthenticated rate limits (60 req/hr)
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Filter and format raw GitHub contents API array
 */
export function parseGitHubContents(contents) {
  if (!Array.isArray(contents)) return [];
  return contents
    .filter(item => {
      if (item.type !== 'file') return false;
      const lower = item.name.toLowerCase();
      return lower.endsWith('.cpp') || lower.endsWith('.h') || lower.endsWith('.hpp') || lower.endsWith('.c');
    })
    .map(item => ({
      name: item.name,
      path: item.path,
      size: item.size,
      download_url: item.download_url,
      html_url: item.html_url
    }));
}

/**
 * Filter and format raw GitHub commits API array
 */
export function parseGitHubCommits(commits) {
  if (!Array.isArray(commits)) return [];
  return commits.map(item => ({
    sha: item.sha,
    shortSha: item.sha ? item.sha.substring(0, 7) : '',
    message: item.commit?.message || '',
    author: item.commit?.author?.name || item.author?.login || 'Anonymous',
    date: item.commit?.author?.date || null,
    html_url: item.html_url
  }));
}

/**
 * Fetch files inside a member's folder (FAN/, GUY/, HAN/)
 */
export function fetchMemberFiles(member, owner = REPO_OWNER, repo = REPO_NAME) {
  const cacheKey = `files_${owner}_${repo}_${member}`;
  const cached = getCached(cacheKey);
  if (cached) return Promise.resolve(cached);

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${member}`;
  return fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`GitHub API returned ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const parsed = parseGitHubContents(data);
      setCached(cacheKey, parsed);
      return parsed;
    })
    .catch(err => {
      console.warn(`Could not fetch GitHub files for ${member}:`, err.message);
      // Fallback if rate limited or offline
      if (member === 'GUY') {
        return [
          { name: '01-GUY.cpp', path: 'GUY/01-GUY.cpp', size: 1231, download_url: null }
        ];
      }
      return [];
    });
}

/**
 * Fetch latest commit for a specific member's directory
 */
export function fetchRecentCommits(member, owner = REPO_OWNER, repo = REPO_NAME) {
  const cacheKey = `commits_${owner}_${repo}_${member}`;
  const cached = getCached(cacheKey);
  if (cached) return Promise.resolve(cached);

  const url = `https://api.github.com/repos/${owner}/${repo}/commits?path=${member}&per_page=3`;
  return fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json'
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`GitHub API returned ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const parsed = parseGitHubCommits(data);
      setCached(cacheKey, parsed);
      return parsed;
    })
    .catch(err => {
      console.warn(`Could not fetch commits for ${member}:`, err.message);
      return [];
    });
}

/**
 * Fetch raw source code of a file
 */
export function fetchFileContent(downloadUrl) {
  if (!downloadUrl) {
    return Promise.resolve('// File content unavailable or stored locally');
  }
  return fetch(downloadUrl)
    .then(res => res.text())
    .catch(err => `// Failed to load code: ${err.message}`);
}
