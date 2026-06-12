/** Admin announcement notifications are sent to this inbox. */
export const ANNOUNCEMENT_NOTIFY_EMAIL = 'poonghuzhali1990@gmail.com'

export async function sendAnnouncementEmail(announcement) {
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(ANNOUNCEMENT_NOTIFY_EMAIL)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        _subject: `EduSmart — New Announcement: ${announcement.title}`,
        _template: 'table',
        _captcha: 'false',
        title: announcement.title,
        content: announcement.content,
        priority: announcement.priority,
        audience: announcement.audience,
        date: announcement.date,
        author: announcement.author || 'Admin Office',
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Email request failed (${response.status})`)
  }

  const data = await response.json().catch(() => ({}))
  if (data.success === 'false') {
    throw new Error(data.message || 'Email delivery failed')
  }

  return data
}
