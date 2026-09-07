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
    const commitText = mGit.latestCommit ? `\n> 📝 ล่าสุด: \`${mGit.latestCommit}\`` : '';

    return {
      name: `${m.avatar || '👤'} ${m.name} (${key})`,
      value: `${isDone ? '✅ เคลียร์เควสต์วันนี้แล้ว' : '⚠️ ยังไม่ส่งงานประจำวัน'} | 🔥 ${m.streak || 0} วันต่อเนื่อง\n> 📁 ไฟล์โค้ด: **${fileCount}** ไฟล์${commitText}`,
      inline: false
    };
  });

  // Determine color: Green if all done, Yellow if partial, Red if none
  let embedColor = 0xef4444; // Red
  if (completedCount === 3) {
    embedColor = 0x10b981; // Green
  } else if (completedCount > 0) {
    embedColor = 0xf59e0b; // Yellow / Amber
  }

  return {
    username: "C-Learn Training Bot",
    avatar_url: "https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/cpp/cpp.png",
    embeds: [
      {
        title: `🚀 [C-Learn Daily Report] รายงานความคืบหน้า Day ${activeDay}`,
        description: `📅 **เป้าหมาย:** ซ้อมเข้มข้นนับถอยหลังสู่การแข่งขันเขียนโค้ด C++ วันที่ 27!\nสถานะทีมวันนี้: เคลียร์แล้ว **${completedCount}/3** คน`,
        color: embedColor,
        fields: fields,
        footer: {
          text: "C-Learn Arena • รักษาความต่อเนื่องเพื่อชัยชนะ! 🔥"
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
    throw new Error('กรุณาระบุ Discord Webhook URL ให้ถูกต้อง');
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
