const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const FEE_COLORS = ['#7c6ce7', '#f472b6', '#38bdf8', '#fb923c', '#6366f1', '#22c55e', '#eab308']
const ATT_COLORS = { present: '#7c6ce7', absent: '#38bdf8', late: '#fb923c', excused: '#f87171' }

export function parseMoney(value) {
  if (value == null || value === '' || value === '-') return 0
  return Number(String(value).replace(/[^0-9.]/g, '')) || 0
}

export function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`
}

export function formatMoneyShort(value) {
  if (value >= 1000) return `${Math.round(value / 1000)}k`
  return String(Math.round(value))
}

function attendanceRate(rows, presentStatuses = ['present', 'late', 'excused']) {
  if (!rows?.length) return 0
  const present = rows.filter((r) => presentStatuses.includes(r.status)).length
  return Math.round((present / rows.length) * 100)
}

function countByStatus(rows) {
  const counts = { present: 0, absent: 0, late: 0, excused: 0 }
  rows.forEach((r) => {
    const key = r.status || 'present'
    if (counts[key] != null) counts[key] += 1
  })
  return counts
}

function normalizeChartValues(rows, key = 'value') {
  const max = Math.max(...rows.map((r) => r[key]), 1)
  return rows.map((r) => ({
    ...r,
    [key]: Math.round((r[key] / max) * 100),
    raw: r[key],
  }))
}

function monthFromDate(dateStr) {
  if (!dateStr || dateStr === '-') return null
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) {
    const parts = dateStr.match(/(\d{4})-(\d{2})/)
    if (parts) return Number(parts[2]) - 1
    return null
  }
  return d.getMonth()
}

export function computeDashboardAdmin({
  students,
  staff,
  classes,
  payments,
  pendingDues,
  announcements,
  approvalRequests,
  attendanceAdminStudents,
  attendanceAdminStaff,
  seed,
}) {
  const activeStaff = staff.filter((s) => s.status === 'Active' || s.status === 'On Leave').length
  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + parseMoney(p.amount), 0)
  const pendingAmount = pendingDues.reduce((sum, p) => sum + parseMoney(p.dueAmount), 0)
  const overdueCount = pendingDues.filter((p) => p.status === 'Overdue').length
  const studentRate = attendanceRate(attendanceAdminStudents)
  const staffRate = attendanceRate(attendanceAdminStaff, ['present', 'late'])
  const liveAttRate = Math.round((studentRate + staffRate) / 2)

  const stats = (seed.stats || []).map((card, idx) => {
    const map = [
      {
        value: students.length.toLocaleString(),
        sub: `${students.filter((s) => s.status === 'Active').length} active enrolled`,
        change: `+${Math.max(0, students.length - 13)}`,
      },
      {
        value: String(activeStaff),
        sub: 'Active employees',
        change: `+${Math.max(0, staff.length - 10)}`,
      },
      {
        value: String(classes.length),
        sub: 'Across all grades',
        change: `+${Math.max(0, classes.length - 7)}`,
      },
      {
        value: formatMoneyShort(totalCollected),
        sub: 'Collected fees (paid)',
        change: `${payments.filter((p) => p.status === 'Paid').length} payments`,
      },
    ]
    return { ...card, ...map[idx] }
  })

  const seedAtt = seed.attendanceData || []
  const avgSeed = seedAtt.length
    ? seedAtt.reduce((s, d) => s + d.value, 0) / seedAtt.length
    : liveAttRate || 1
  const ratio = avgSeed ? liveAttRate / avgSeed : 1
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  const attendanceData = seedAtt.map((d, i) => ({
    ...d,
    value: Math.min(100, Math.max(0, Math.round(i === todayIdx ? liveAttRate : d.value * ratio))),
  }))

  const monthTotals = MONTH_LABELS.map((month, idx) => ({
    id: idx + 1,
    month,
    value: payments
      .filter((p) => p.status === 'Paid' && monthFromDate(p.paidDate) === idx)
      .reduce((sum, p) => sum + parseMoney(p.amount), 0),
  }))

  const feeData = normalizeChartValues(
    monthTotals.filter((m) => m.value > 0).length
      ? monthTotals
      : (seed.feeData || []).map((d) => ({ ...d, value: d.value * 1000 })),
  )

  const recentStudents = [...students]
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0))
    .slice(0, 3)
  const recentPayments = [...payments]
    .filter((p) => p.status === 'Paid')
    .slice(0, 2)
  const recentAnnouncements = [...announcements].slice(-2)

  const activities = [
    ...recentStudents.map((s, i) => ({
      id: `stu-${s.id}`,
      icon: 'GradCap',
      tone: 'violet',
      text: `${s.name} enrolled in ${s.grade}`,
      badge: s.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      who: 'Admin Elena',
      time: s.joined || 'Recently',
    })),
    ...recentPayments.map((p) => ({
      id: `pay-${p.id}`,
      icon: 'Rupee',
      tone: 'green',
      text: `${p.name} paid ${p.feeType} fee (${p.amount})`,
      badge: p.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      who: p.name,
      time: p.paidDate || 'Recently',
    })),
    ...recentAnnouncements.map((a) => ({
      id: `ann-${a.id}`,
      icon: 'Bell',
      tone: 'violet',
      text: `${a.title} published`,
      badge: 'AE',
      who: a.author?.replace('By ', '') || 'Admin',
      time: a.date || 'Recently',
    })),
  ].slice(0, 6)

  const absentStudents = attendanceAdminStudents.filter((s) => s.status === 'absent').length
  const pendingApprovals = approvalRequests.filter((r) => r.status === 'Pending')

  const alerts = [
    {
      id: 'pending-dues',
      icon: 'Warning',
      tone: 'amber',
      title: 'Fee payment overdue',
      text: `${pendingDues.length} student(s) have pending or overdue fee payments (${formatMoney(pendingAmount)}).`,
    },
    {
      id: 'attendance',
      icon: 'Warning',
      tone: 'amber',
      title: 'Attendance Alert',
      text: absentStudents
        ? `${absentStudents} student(s) marked absent today (${studentRate}% attendance).`
        : `Student attendance is at ${studentRate}% today.`,
    },
    {
      id: 'approvals',
      icon: 'Bell',
      tone: 'blue',
      title: 'Approval Request',
      text: `${pendingApprovals.length} request(s) waiting for your action.`,
    },
    {
      id: 'announcements',
      icon: 'Bell',
      tone: 'blue',
      title: 'Latest Announcement',
      text: announcements.length
        ? announcements[announcements.length - 1].title
        : 'No announcements published yet.',
    },
  ]

  const approvals = pendingApprovals.slice(0, 5).map((r) => ({
    id: r.id,
    name: r.name,
    tag: r.category || 'Request',
    tagTone: 'amber',
    desc: r.desc,
  }))

  return {
    stats,
    attendanceData,
    feeData,
    activities,
    alerts,
    approvals,
    liveMetrics: {
      studentRate,
      staffRate,
      totalCollected,
      pendingAmount,
      overdueCount,
    },
  }
}

export function computeFeeSummary(payments, pendingDues, seed = []) {
  const collected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + parseMoney(p.amount), 0)
  const pending = pendingDues.reduce((sum, p) => sum + parseMoney(p.dueAmount), 0)
  const overdue = pendingDues
    .filter((p) => p.status === 'Overdue')
    .reduce((sum, p) => sum + parseMoney(p.dueAmount), 0)

  const values = [
    formatMoney(collected),
    formatMoney(pending),
    formatMoney(overdue),
  ]

  return (seed.length ? seed : []).map((card, i) => ({
    ...card,
    value: values[i] ?? card.value,
  }))
}

export function computeReports({
  students,
  staff,
  subjects,
  payments,
  pendingDues,
  attendanceAdminStudents,
  attendanceAdminStaff,
  examsAdmin,
  seed,
}) {
  const studentRate = attendanceRate(attendanceAdminStudents)
  const staffRate = attendanceRate(attendanceAdminStaff, ['present', 'late'])
  const absentRate = 100 - studentRate
  const studentCounts = countByStatus(attendanceAdminStudents)
  const totalAtt = attendanceAdminStudents.length || 1

  const subjectData = subjects.map((s, i) => ({
    id: s.id ?? i + 1,
    subject: s.name,
    avg: Math.min(98, Math.max(55, 68 + (parseInt(String(s.hours), 10) || 4) * 2 + (i % 5))),
  }))

  const gradeGroups = {}
  students.forEach((s) => {
    const grade = (s.grade || '').split('-')[0]?.trim() || 'Other'
    if (!gradeGroups[grade]) gradeGroups[grade] = { total: 0, inactive: 0 }
    gradeGroups[grade].total += 1
    if (s.status === 'Inactive') gradeGroups[grade].inactive += 1
  })

  const passFailData = Object.entries(gradeGroups).map(([grade, { total, inactive }], i) => {
    const failPct = Math.round((inactive / total) * 100) + (total % 3)
    const pass = Math.min(100, Math.max(0, 100 - failPct))
    return { id: i + 1, grade, pass, fail: 100 - pass }
  })

  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + parseMoney(p.amount), 0)
  const pendingTotal = pendingDues.reduce((sum, p) => sum + parseMoney(p.dueAmount), 0)
  const overdueTotal = pendingDues
    .filter((p) => p.status === 'Overdue')
    .reduce((sum, p) => sum + parseMoney(p.dueAmount), 0)

  const monthTotals = MONTH_LABELS.map((month, idx) => ({
    id: idx + 1,
    month,
    value: payments
      .filter((p) => p.status === 'Paid' && monthFromDate(p.paidDate) === idx)
      .reduce((sum, p) => sum + parseMoney(p.amount), 0),
  }))

  const monthlyCollection = normalizeChartValues(
    monthTotals.some((m) => m.value > 0) ? monthTotals : (seed.monthlyCollection || []),
  )

  const feeByType = {}
  payments.filter((p) => p.status === 'Paid').forEach((p) => {
    const key = p.feeType || 'Other'
    feeByType[key] = (feeByType[key] || 0) + parseMoney(p.amount)
  })
  const feeTotal = Object.values(feeByType).reduce((a, b) => a + b, 0) || 1
  const feeCategoryData = Object.entries(feeByType).map(([name, amount], i) => ({
    id: i + 1,
    name,
    value: Math.round((amount / feeTotal) * 100),
    color: FEE_COLORS[i % FEE_COLORS.length],
  }))

  const liveStudentRate = studentRate
  const liveStaffRate = staffRate
  const monthlyAttendance = (seed.monthlyAttendance || []).map((row, i, arr) => {
    const isLast = i === arr.length - 1
    return {
      ...row,
      students: isLast ? liveStudentRate : row.students,
      staff: isLast ? liveStaffRate : row.staff,
    }
  })

  const attendanceBreakdown = [
    { id: 1, name: 'Present', value: Math.round((studentCounts.present / totalAtt) * 100), color: ATT_COLORS.present },
    { id: 2, name: 'Absent', value: Math.round((studentCounts.absent / totalAtt) * 100), color: ATT_COLORS.absent },
    { id: 3, name: 'Late', value: Math.round((studentCounts.late / totalAtt) * 100), color: ATT_COLORS.late },
    { id: 4, name: 'Excuse', value: Math.round((studentCounts.excused / totalAtt) * 100), color: ATT_COLORS.excused },
  ]

  const completedExams = examsAdmin.filter((e) => e.status?.toLowerCase() === 'completed').length
  const passRate = passFailData.length
    ? Math.round(passFailData.reduce((s, g) => s + g.pass, 0) / passFailData.length)
    : 92

  return {
    ...seed,
    academicStats: [
      { id: 1, value: `${passRate}%`, label: 'Overall Average', sub: `${subjects.length} subjects tracked`, icon: 'CalendarCheck', tone: 'blue' },
      { id: 2, value: `${passRate}%`, label: 'Pass Rate', sub: `${completedExams} exams completed`, icon: 'CheckCircle', tone: 'blue' },
      { id: 3, value: students[0]?.name?.split(' ')[0] || '—', label: 'Top Score', sub: `${students.length} students`, icon: 'Book', tone: 'purple' },
      { id: 4, value: String(students.filter((s) => s.status === 'Inactive').length), label: 'Risk students', sub: 'Inactive or below target', icon: 'Users', tone: 'orange' },
    ],
    subjectData,
    passFailData: passFailData.length ? passFailData : seed.passFailData,
    financialStats: [
      { id: 1, value: formatMoney(totalCollected), label: 'Total Collected', sub: `${payments.filter((p) => p.status === 'Paid').length} payments`, icon: 'DollarSign', tone: 'green' },
      { id: 2, value: formatMoney(pendingTotal), label: 'Pending dues', sub: `${pendingDues.length} students`, icon: 'Warning', tone: 'orange' },
      { id: 3, value: formatMoney(overdueTotal), label: 'Overdue Amounts', sub: `${pendingDues.filter((p) => p.status === 'Overdue').length} overdue`, icon: 'TrendDown', tone: 'red' },
    ],
    monthlyCollection,
    feeCategoryData: feeCategoryData.length ? feeCategoryData : seed.feeCategoryData,
    attendanceStats: [
      { id: 1, value: `${Math.round((studentRate + staffRate) / 2)}%`, label: 'Overall Attendance', sub: 'Live from today\'s records', icon: 'CalendarCheck', tone: 'blue' },
      { id: 2, value: `${studentRate}%`, label: 'Student Attendance', sub: `${attendanceAdminStudents.length} students`, icon: 'Users', tone: 'purple' },
      { id: 3, value: `${staffRate}%`, label: 'Staff Attendance', sub: `${attendanceAdminStaff.length} staff`, icon: 'CheckCircle', tone: 'green' },
      { id: 4, value: `${absentRate}%`, label: 'Absent Rate', sub: `${studentCounts.absent} absent today`, icon: 'TrendUp', tone: 'orange' },
    ],
    monthlyAttendance,
    attendanceBreakdown,
  }
}

function avgStudentMarks(markRow) {
  const vals = ['math', 'algebra', 'stats']
    .map((k) => Number(markRow[k]))
    .filter((n) => !Number.isNaN(n))
  if (!vals.length) return 0
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
}

function teacherAttendanceRate(rows) {
  if (!rows?.length) return 0
  const present = rows.filter((s) => s.status === 'Present' || s.status === 'Late').length
  return Math.round((present / rows.length) * 100)
}

export function computeTeacherDashboard({
  teacherClasses,
  teacherStudents,
  teacherAttendanceStudents,
  teacherAssignments,
  teacherMarks,
  teacherProfile,
  seed,
}) {
  const classCount = teacherClasses.length
  const studentCount = teacherStudents.length
  const attRate = teacherAttendanceRate(teacherAttendanceStudents)
  const pendingTasks = teacherAssignments.filter(
    (a) => a.status?.toLowerCase() !== 'completed' && a.status?.toLowerCase() !== 'closed',
  ).length

  const avgMark = teacherMarks.length
    ? Math.round(
      teacherMarks.reduce((s, m) => s + avgStudentMarks(m), 0) / teacherMarks.length,
    )
    : 80
  const topMark = teacherMarks.length
    ? Math.max(...teacherMarks.map((m) => avgStudentMarks(m)))
    : 95

  const monthShort = MONTH_LABELS.slice(0, 8)
  const attendanceData = monthShort.map((month, i) => ({
    id: i + 1,
    month,
    value: Math.min(100, Math.max(0, attRate + (i - 7) * 1)),
  }))
  attendanceData[attendanceData.length - 1].value = attRate

  const performanceData = monthShort.map((month, i) => ({
    id: i + 1,
    month,
    avg: Math.min(100, Math.max(0, avgMark + i - 4)),
    top: Math.min(100, Math.max(avgMark, topMark + i - 7)),
  }))

  const recentActivity = [
    ...teacherAssignments.slice(0, 2).map((a) => ({
      id: `asg-${a.id}`,
      text: `${a.title} — ${a.submitted}/${a.total} submitted`,
      time: a.due || 'Recently',
    })),
    ...teacherMarks.slice(0, 2).map((m) => ({
      id: `mark-${m.id}`,
      text: `${m.name} scored ${avgStudentMarks(m)}% average`,
      time: 'Recently',
    })),
  ].slice(0, 4)

  return {
    ...seed,
    welcomeName: teacherProfile?.name?.split(' ')[0] || seed.welcomeName,
    stats: (seed.stats || []).map((card, idx) => {
      const mapped = [
        { value: String(classCount), change: `${classCount} classes`, up: true },
        { value: String(studentCount), change: `${studentCount} students`, up: true },
        { value: `${attRate}%`, change: 'live rate', up: attRate >= 80 },
        { value: String(pendingTasks), change: `${pendingTasks} open`, up: pendingTasks <= 3 },
      ]
      return { ...card, ...mapped[idx] }
    }),
    attendanceData,
    performanceData,
    recentActivity: recentActivity.length ? recentActivity : seed.recentActivity,
  }
}

export function computeTeacherAttendanceMonthly(teacherAttendanceStudents, seedMonthly = []) {
  const rate = teacherAttendanceRate(teacherAttendanceStudents)
  if (!seedMonthly.length) {
    return MONTH_LABELS.slice(0, 6).map((month, i) => ({
      id: i + 1,
      month,
      value: Math.min(100, Math.max(0, rate + i - 3)),
    }))
  }
  return seedMonthly.map((row, i, arr) => ({
    ...row,
    value: i === arr.length - 1 ? rate : row.value,
  }))
}

export { MONTH_NAMES, DAY_LABELS }
