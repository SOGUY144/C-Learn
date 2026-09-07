/**
 * Discord Webhook Reporting Service
 */

export function buildDiscordReportPayload(state, gitData = {}, activeDay = 1) {
  const members = state.members || {};
  const memberKeys = ['GUY', 'FAN', 'HAN'];

  let completedCount = 0;
  const fields = memberKeys.map(key => {
    const m = members[key] || { id: key, name: key, streak: 0, completedQuests: {} };
    const isDone = !!m.completedQuests[activeDay];
    if (isDone) completedCount++;

    const mGit = gitData[key] || { files: [], latestCommit: null };
    const fileCount = mGit.files ? mGit.files.length : 0;
    const commitText = mGit.latestCommit ? `\n> Commit: \`${mGit.latestCommit}\`` : '';

    return {
      name: `${m.name} (${key})`,
      value: `Status: ${isDone ? 'Completed' : 'Pending'} | ${m.streak || 0}d streak\n> Files: **${fileCount}**${commitText}`,
      inline: false
    };
  });

  let embedColor = 0x71717a; // Neutral zinc
  if (completedCount === 3) {
    embedColor = 0x10b981; // Green
  } else if (completedCount > 0) {
    embedColor = 0x3b82f6; // Blue
  }

  return {
    username: "C-Learn Tracker",
    avatar_url: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/cpp/cpp.png",
    embeds: [
      {
        title: `[C-Learn] Daily Report - Day ${activeDay}`,
        description: `Contest Preparation | Team completed: **${completedCount}/3**`,
        color: embedColor,
        fields: fields,
        footer: {
          text: "C-Learn Team Tracking"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };
}

/**
 * Send Discord Webhook payload
 */
export async function sendDiscordWebhook(webhookUrl, payload) {
  if (!webhookUrl || !webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    throw new Error('Please enter a valid Discord Webhook URL.');
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
  }

  return true;
}
