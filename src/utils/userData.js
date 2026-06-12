/** Shared helpers — students.json, staff.json, parents.json are the single source of truth. */

export function parseGradeClass(gradeStr = '') {
  const match = gradeStr.match(/Grade\s*(\d+)\s*[-–]\s*([A-Za-z])/i)
  if (!match) {
    return { grade: gradeStr, className: gradeStr, classTag: gradeStr, section: '', gradeNum: '' }
  }
  const gradeNum = match[1]
  const section = match[2].toUpperCase()
  const grade = `Grade ${gradeNum}`
  return {
    grade,
    className: `${grade} ${section}`,
    classTag: `${gradeNum}-${section}`,
    section,
    gradeNum,
  }
}

export function formatLinkedStudent(student) {
  const { gradeNum } = parseGradeClass(student.grade)
  const shortGrade = gradeNum ? `Gr ${gradeNum}` : student.grade
  return `${student.name} - ${shortGrade}`
}

export function linkedStudentsForParent(parent, students) {
  if (!parent) return []
  const guardianKey = parent.name.trim().toLowerCase()
  return students.filter(
    (s) => s.guardian?.trim().toLowerCase() === guardianKey,
  )
}

export function formatShortGrade(gradeStr) {
  const { gradeNum } = parseGradeClass(gradeStr)
  return gradeNum ? `Grade ${gradeNum} ${parseGradeClass(gradeStr).section}`.trim() : gradeStr
}

function hashSeed(id, salt = 0) {
  return ((id * 17 + salt * 31) % 40)
}

export function studentToTeacherStudent(student) {
  const { classTag } = parseGradeClass(student.grade)
  const attendance = Math.min(100, Math.max(55, 70 + hashSeed(student.id, 1)))
  const score = Math.min(98, Math.max(52, 62 + hashSeed(student.id, 2)))
  let attLabel = 'Good'
  let attTone = 'green'
  if (attendance >= 95) { attLabel = 'Excellent'; attTone = 'green' }
  else if (attendance >= 85) { attLabel = 'Good'; attTone = 'green' }
  else if (attendance >= 75) { attLabel = 'Need Attention'; attTone = 'orange' }
  else { attLabel = 'At Risk'; attTone = 'red' }

  const pct = Math.round((score / 100) * 100)
  let grade = 'B'
  let barTone = 'blue'
  if (pct >= 90) { grade = 'A+'; barTone = 'green' }
  else if (pct >= 80) { grade = 'A'; barTone = 'blue' }
  else if (pct >= 70) { grade = 'B+'; barTone = 'orange' }
  else if (pct >= 60) { grade = 'C+'; barTone = 'red' }
  else { grade = 'C'; barTone = 'red' }

  return {
    id: student.id,
    name: student.name,
    studentId: student.studentId,
    avatar: student.avatar,
    classTag,
    attendance,
    attLabel,
    attTone,
    grade,
    score,
    total: 100,
    barTone,
  }
}

export function buildTeacherClassOptions(students) {
  const tags = [...new Set(students.map((s) => parseGradeClass(s.grade).classTag).filter(Boolean))]
  tags.sort((a, b) => {
    const [aG, aS] = a.split('-')
    const [bG, bS] = b.split('-')
    return Number(aG) - Number(bG) || aS.localeCompare(bS)
  })
  return ['All Classes', ...tags]
}

const ATTENDANCE_STATUSES = ['present', 'present', 'present', 'absent', 'late', 'excused']
const TEACHER_ATT_STATUSES = ['Present', 'Present', 'Present', 'Absent', 'Late', 'Present']

function staffAttendanceDepartment(member) {
  const subjects = (member.subjects || '').toLowerCase()
  if (/algebra|geometry|math/.test(subjects)) return 'Mathematics'
  if (/physics|chemistry|biology|science/.test(subjects)) return 'Science'
  if (/english|literature|counsel/.test(subjects)) return 'English'
  if (/history|civic/.test(subjects)) return 'History'
  if (/physical|education|coach/.test(subjects)) return 'Physical Education'
  const dept = (member.department || '').toLowerCase()
  if (dept.includes('math')) return 'Mathematics'
  if (dept.includes('science')) return 'Science'
  if (dept.includes('english')) return 'English'
  if (dept.includes('history')) return 'History'
  if (dept.includes('physical') || dept.includes('coach')) return 'Physical Education'
  return 'Mathematics'
}

export function studentToAttendanceAdmin(student, existing) {
  const parsed = parseGradeClass(student.grade)
  const defaultStatus = ATTENDANCE_STATUSES[student.id % ATTENDANCE_STATUSES.length]
  return {
    id: student.id,
    name: student.name,
    studentId: student.studentId,
    rollNo: student.studentId,
    className: student.grade,
    grade: parsed.grade || student.grade,
    status: existing?.status || defaultStatus,
    remarks: existing?.remarks || '',
  }
}

export function staffToAttendanceAdmin(member, existing) {
  const defaultStatus = member.status === 'On Leave' ? 'absent' : ATTENDANCE_STATUSES[member.id % ATTENDANCE_STATUSES.length]
  return {
    id: member.id,
    name: member.name,
    employeeId: member.employeeId,
    department: staffAttendanceDepartment(member),
    role: member.department,
    status: existing?.status || defaultStatus,
    remarks: existing?.remarks || (member.status === 'On Leave' ? 'On leave' : ''),
  }
}

export function studentToTeacherAttendance(student, existing, index) {
  const defaultStatus = TEACHER_ATT_STATUSES[(student.id + index) % TEACHER_ATT_STATUSES.length]
  return {
    id: student.id,
    name: student.name,
    roll: String(index + 1).padStart(2, '0'),
    avatar: student.avatar,
    status: existing?.status || defaultStatus,
  }
}

export function studentToExamMark(student, existing) {
  const base = existing
    ? { math: existing.math, algebra: existing.algebra, stats: existing.stats }
    : {
      math: Math.min(98, 58 + hashSeed(student.id, 3)),
      algebra: Math.min(98, 55 + hashSeed(student.id, 4)),
      stats: Math.min(98, 60 + hashSeed(student.id, 5)),
    }
  return {
    id: student.id,
    name: student.name,
    studentId: student.studentId,
    avatar: student.avatar,
    ...base,
  }
}

export function syncAttendanceStudents(students, prev = []) {
  const prevById = new Map(
    Array.isArray(prev)
      ? prev.map((row) => [row.id, row])
      : Object.entries(prev).map(([id, row]) => [Number(id), row]),
  )
  return students.map((student) => studentToAttendanceAdmin(student, prevById.get(student.id)))
}

export function syncAttendanceStaff(staff, prev = []) {
  const prevById = new Map(
    Array.isArray(prev)
      ? prev.map((row) => [row.id, row])
      : Object.entries(prev).map(([id, row]) => [Number(id), row]),
  )
  return staff.map((member) => staffToAttendanceAdmin(member, prevById.get(member.id)))
}

export function syncTeacherAttendance(students, prev = []) {
  const active = students.filter((s) => s.status === 'Active')
  const prevById = new Map(prev.map((row) => [row.id, row]))
  return active.map((student, index) => studentToTeacherAttendance(student, prevById.get(student.id), index))
}

export function syncTeacherMarks(students, prev = []) {
  const active = students.filter((s) => s.status === 'Active')
  const prevById = new Map(prev.map((row) => [row.id, row]))
  return active.map((student) => studentToExamMark(student, prevById.get(student.id)))
}

export function syncPaymentStudentFields(students, payments) {
  const byStudentId = new Map(students.map((s) => [s.studentId, s]))
  const byName = new Map(students.map((s) => [s.name.toLowerCase(), s]))
  return payments.map((payment) => {
    const student = byStudentId.get(payment.studentId)
      || byName.get(payment.name?.toLowerCase())
    if (!student) return payment
    const parsed = parseGradeClass(student.grade)
    return {
      ...payment,
      name: student.name,
      studentId: student.studentId,
      avatar: student.avatar,
      grade: parsed.className || student.grade,
    }
  })
}

export function syncParentsWithStudents(students, parents) {
  const guardianMap = new Map()
  students.forEach((student) => {
    if (!student.guardian) return
    const key = student.guardian.trim().toLowerCase()
    if (!guardianMap.has(key)) guardianMap.set(key, [])
    guardianMap.get(key).push(formatLinkedStudent(student))
  })

  const parentByName = new Map(parents.map((p) => [p.name.trim().toLowerCase(), p]))
  const usedKeys = new Set()

  const updated = parents.map((parent) => {
    const key = parent.name.trim().toLowerCase()
    usedKeys.add(key)
    const linked = guardianMap.get(key)
    if (linked) {
      return { ...parent, linkedStudents: [...new Set(linked)] }
    }
    return parent
  })

  guardianMap.forEach((linkedStudents, guardianKey) => {
    if (usedKeys.has(guardianKey)) return
    const guardianName = students.find(
      (s) => s.guardian?.trim().toLowerCase() === guardianKey,
    )?.guardian
    if (!guardianName) return
    updated.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: guardianName,
      email: `${guardianName.split(' ')[0].toLowerCase()}@example.com`,
      contact: '',
      linkedStudents: [...new Set(linkedStudents)],
      status: 'Active',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: Math.floor(Math.random() * 70) + 1,
    })
  })

  return updated
}

export function upsertParentForStudent(parentsApi, student) {
  if (!student.guardian) return
  const guardianName = student.guardian.trim()
  const key = guardianName.toLowerCase()
  const existing = parentsApi.items.find((p) => p.name.trim().toLowerCase() === key)
  const link = formatLinkedStudent(student)

  if (existing) {
    const linked = [...new Set([...(existing.linkedStudents || []), link])]
    parentsApi.update(existing.id, { linkedStudents: linked })
  } else {
    parentsApi.add({
      name: guardianName,
      email: `${guardianName.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
      contact: '',
      linkedStudents: [link],
      status: 'Active',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      avatar: Math.floor(Math.random() * 70) + 1,
    })
  }
}
