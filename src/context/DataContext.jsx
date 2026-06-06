import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import studentsSeed from '../data/students.json'
import staffSeed from '../data/staff.json'
import parentsSeed from '../data/parents.json'
import classesSeed from '../data/classes.json'
import subjectsSeed from '../data/subjects.json'
import timetableSeed from '../data/timetable.json'
import examsAdminSeed from '../data/exams-admin.json'
import feesSeed from '../data/fees.json'
import communicationSeed from '../data/communication.json'
import documentsSeed from '../data/documents.json'
import approvalsSeed from '../data/approvals.json'
import reportsSeed from '../data/reports.json'
import settingsSeed from '../data/settings.json'
import dashboardAdminSeed from '../data/dashboard-admin.json'
import attendanceAdminSeed from '../data/attendance-admin.json'
import gradesSeed from '../data/grades.json'
import teacherDashboardSeed from '../data/teacher-dashboard.json'
import teacherClassesSeed from '../data/teacher-classes.json'
import teacherStudentsSeed from '../data/teacher-students.json'
import teacherAttendanceSeed from '../data/teacher-attendance.json'
import teacherAssignmentsSeed from '../data/teacher-assignments.json'
import teacherExamsSeed from '../data/teacher-exams.json'
import teacherMessagesSeed from '../data/teacher-messages.json'
import teacherSettingsSeed from '../data/teacher-settings.json'
import teacherAiSeed from '../data/teacher-ai-assistant.json'
import {
  computeDashboardAdmin,
  computeFeeSummary,
  computeReports,
  computeTeacherDashboard,
  computeTeacherAttendanceMonthly,
} from '../utils/analytics.js'

const DataContext = createContext(null)

function clone(data) {
  return JSON.parse(JSON.stringify(data))
}

function useCollection(initial) {
  const [items, setItems] = useState(() => clone(initial))

  const add = useCallback((item) => {
    setItems((prev) => [...prev, { ...item, id: Date.now() + Math.floor(Math.random() * 1000) }])
  }, [])

  const update = useCallback((id, patch) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }, [])

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  return { items, setItems, add, update, remove }
}

export function DataProvider({ children }) {
  const students = useCollection(studentsSeed)
  const staff = useCollection(staffSeed)
  const parents = useCollection(parentsSeed)
  const classes = useCollection(classesSeed)
  const subjects = useCollection(subjectsSeed)
  const examsAdmin = useCollection(examsAdminSeed)
  const feeCategories = useCollection(feesSeed.feeCategories)
  const payments = useCollection(feesSeed.payments)
  const pendingDues = useCollection(feesSeed.pendingDues)
  const announcements = useCollection(communicationSeed.announcements)
  const documents = useCollection(documentsSeed.documents)
  const studentRecords = useCollection(documentsSeed.studentRecords)
  const certificates = useCollection(documentsSeed.certificates)
  const approvalRequests = useCollection(approvalsSeed.requests)

  const [timetable] = useState(() => clone(timetableSeed))
  const [reportsSeedState] = useState(() => clone(reportsSeed))
  const [dashboardAdminSeedState] = useState(() => clone(dashboardAdminSeed))
  const [attendanceAdminStudents, setAttendanceAdminStudents] = useState(() => clone(attendanceAdminSeed.students))
  const [attendanceAdminStaff, setAttendanceAdminStaff] = useState(() => clone(attendanceAdminSeed.staff))
  const [permissions, setPermissions] = useState(() => clone(settingsSeed.permissions))
  const [academicYears, setAcademicYears] = useState(() => clone(settingsSeed.academicYears))
  const [schoolProfile, setSchoolProfile] = useState(() => clone(settingsSeed.schoolProfile))
  const [integrations, setIntegrations] = useState(() => clone(settingsSeed.integrations))
  const [notificationGroups, setNotificationGroups] = useState(() => clone(communicationSeed.notificationGroups))

  const [teacherClasses, setTeacherClasses] = useState(() => clone(teacherClassesSeed))
  const [teacherStudents] = useState(() => clone(teacherStudentsSeed.students))
  const [teacherAttendanceStudents, setTeacherAttendanceStudents] = useState(() => clone(teacherAttendanceSeed.students))
  const [teacherAssignments, setTeacherAssignments] = useState(() => clone(teacherAssignmentsSeed.assignments))
  const [teacherMarks, setTeacherMarks] = useState(() => clone(teacherExamsSeed.marks))
  const [messageState, setMessageState] = useState(() => clone(teacherMessagesSeed))
  const [teacherProfile, setTeacherProfile] = useState(() => clone(teacherSettingsSeed.profile))
  const [teacherNotifications, setTeacherNotifications] = useState(() => clone(teacherSettingsSeed.notifications))
  const [teacherDashboardSeedState] = useState(() => clone(teacherDashboardSeed))

  const dashboardAdmin = useMemo(() => computeDashboardAdmin({
    students: students.items,
    staff: staff.items,
    classes: classes.items,
    payments: payments.items,
    pendingDues: pendingDues.items,
    announcements: announcements.items,
    approvalRequests: approvalRequests.items,
    attendanceAdminStudents,
    attendanceAdminStaff,
    seed: dashboardAdminSeedState,
  }), [
    students.items, staff.items, classes.items, payments.items, pendingDues.items,
    announcements.items, approvalRequests.items, attendanceAdminStudents,
    attendanceAdminStaff, dashboardAdminSeedState,
  ])

  const reports = useMemo(() => computeReports({
    students: students.items,
    staff: staff.items,
    subjects: subjects.items,
    payments: payments.items,
    pendingDues: pendingDues.items,
    attendanceAdminStudents,
    attendanceAdminStaff,
    examsAdmin: examsAdmin.items,
    seed: reportsSeedState,
  }), [
    students.items, staff.items, subjects.items, payments.items, pendingDues.items,
    attendanceAdminStudents, attendanceAdminStaff, examsAdmin.items, reportsSeedState,
  ])

  const feeSummary = useMemo(
    () => computeFeeSummary(payments.items, pendingDues.items, feesSeed.summaryStats),
    [payments.items, pendingDues.items],
  )

  const teacherDashboard = useMemo(() => computeTeacherDashboard({
    teacherClasses,
    teacherStudents,
    teacherAttendanceStudents,
    teacherAssignments,
    teacherMarks,
    teacherProfile,
    seed: teacherDashboardSeedState,
  }), [
    teacherClasses, teacherStudents, teacherAttendanceStudents,
    teacherAssignments, teacherMarks, teacherProfile, teacherDashboardSeedState,
  ])

  const teacherAttendanceChart = useMemo(
    () => computeTeacherAttendanceMonthly(
      teacherAttendanceStudents,
      teacherAttendanceSeed.monthlyData,
    ),
    [teacherAttendanceStudents],
  )

  const value = useMemo(() => ({
    grades: gradesSeed,
    students,
    staff,
    parents,
    classes,
    subjects,
    timetable,
    examsAdmin,
    feeCategories,
    payments,
    pendingDues,
    feeSummary,
    announcements,
    notificationGroups,
    setNotificationGroups,
    broadcastStats: communicationSeed.broadcastStats,
    communicationChannels: communicationSeed.channels,
    recipientGroups: communicationSeed.recipientGroups,
    audienceOptions: communicationSeed.audienceOptions || ['Everyone', 'Students', 'Parents', 'Teachers'],
    documents,
    studentRecords,
    certificates,
    documentStats: documentsSeed.statCards,
    documentTypeOptions: documentsSeed.typeOptions,
    approvalRequests,
    approvalSummary: approvalsSeed.summaryStats,
    approvalStatusOptions: approvalsSeed.statusOptions,
    approvalModeTabs: approvalsSeed.modeTabs,
    attendanceAdminStudents,
    setAttendanceAdminStudents,
    attendanceAdminStaff,
    setAttendanceAdminStaff,
    attendanceAdminMeta: {
      gradeOptions: attendanceAdminSeed.gradeOptions,
      deptOptions: attendanceAdminSeed.deptOptions,
      defaultDate: attendanceAdminSeed.defaultDate,
    },
    permissions,
    setPermissions,
    academicYears,
    setAcademicYears,
    schoolProfile,
    setSchoolProfile,
    integrations,
    setIntegrations,
    boardOptions: settingsSeed.boardOptions,
    reports,
    dashboardAdmin,
    teacherDashboard,
    teacherAttendanceChart,
    teacherClasses,
    setTeacherClasses,
    teacherStudents,
    teacherStudentsMeta: { classOptions: teacherStudentsSeed.classOptions },
    teacherAttendanceStudents,
    setTeacherAttendanceStudents,
    teacherAttendanceMeta: teacherAttendanceSeed,
    teacherAssignments,
    setTeacherAssignments,
    teacherAssignmentStats: teacherAssignmentsSeed.statCards,
    teacherAssignmentFilters: {
      classOptions: teacherAssignmentsSeed.classOptions,
      statusOptions: teacherAssignmentsSeed.statusOptions,
    },
    teacherExamsMeta: teacherExamsSeed,
    teacherMarks,
    setTeacherMarks,
    messageState,
    setMessageState,
    teacherProfile,
    setTeacherProfile,
    teacherNotifications,
    setTeacherNotifications,
    teacherAi: teacherAiSeed,
  }), [
    students, staff, parents, classes, subjects, examsAdmin,
    feeCategories, payments, pendingDues, announcements, notificationGroups,
    documents, studentRecords, certificates, approvalRequests,
    attendanceAdminStudents, attendanceAdminStaff, permissions, academicYears,
    schoolProfile, integrations, teacherClasses, teacherStudents,
    teacherAttendanceStudents, teacherAssignments, teacherMarks, messageState,
    teacherProfile, teacherNotifications, dashboardAdmin, reports, feeSummary,
    teacherDashboard, teacherAttendanceChart,
  ])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
