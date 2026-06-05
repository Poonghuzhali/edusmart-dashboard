// Lightweight inline SVG icon set used across the dashboard.
// Each icon inherits color via `currentColor` and accepts a size prop.

const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export const GradCap = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M22 10 12 5 2 10l10 5 10-5Z" />
    <path d="M6 12v5c0 1 2.7 2.5 6 2.5s6-1.5 6-2.5v-5" />
    <path d="M22 10v6" />
  </svg>
)

export const Users = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

export const User = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

export const Book = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
)

export const Rupee = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13l8.5 8" />
    <path d="M6 13h3a5 5 0 0 0 0-10" />
  </svg>
)

export const Grid = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const UsersNav = ({ size = 20 }) => <Users size={size} />

export const BookNav = ({ size = 20 }) => <Book size={size} />

export const Calendar = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
)

export const RupeeNav = ({ size = 20 }) => <Rupee size={size} />

export const Chat = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.38 8.38 0 0 1 8.5-8.5 8.5 8.5 0 0 1 8.5 8.5Z" />
  </svg>
)

export const BarChart = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 20V10M18 20V4M6 20v-4" />
  </svg>
)

export const Folder = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2Z" />
  </svg>
)

export const Settings = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </svg>
)

export const Approvals = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
)

export const Logout = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="M16 17l5-5-5-5M21 12H9" />
  </svg>
)

export const Search = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const Bell = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
)

export const Plus = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const Megaphone = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="m3 11 18-5v12L3 14v-3Z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
)

export const TrendUp = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M23 6l-9.5 9.5-5-5L1 18" />
    <path d="M17 6h6v6" />
  </svg>
)

export const CheckCircle = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m22 4-10 10.01-3-3" />
  </svg>
)

export const XCircle = ({ size = 16 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6M9 9l6 6" />
  </svg>
)

export const Menu = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

export const Close = ({ size = 22 }) => (
  <svg {...base(size)}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const Mail = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
)

export const Lock = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

export const Warning = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
)

export const Upload = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5M12 3v12" />
  </svg>
)

export const Filter = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />
  </svg>
)

export const ChevronDown = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const ChevronLeft = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="m15 18-6-6 6-6" />
  </svg>
)

export const ChevronRight = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="m9 18 6-6-6-6" />
  </svg>
)

export const Pencil = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
)

export const Trash = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </svg>
)

export const Clock = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
)

export const Clipboard = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
  </svg>
)

export const MapPin = ({ size = 14 }) => (
  <svg {...base(size)}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const GripVertical = ({ size = 16 }) => (
  <svg {...base(size)} fill="currentColor" stroke="none">
    <circle cx="9" cy="5" r="1.5" />
    <circle cx="15" cy="5" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="19" r="1.5" />
    <circle cx="15" cy="19" r="1.5" />
  </svg>
)

export const Layers = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="m12 2 8 4.5v9L12 20l-8-4.5v-9Z" />
    <path d="m12 11 8-4.5M12 11v9M12 11 4 6.5" />
  </svg>
)

export const Wallet = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a4 4 0 0 1 0 8h-3" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15v-7" />
    <path d="M18 12v.01" />
  </svg>
)

export const AlertCircle = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
)

export const CalendarPlus = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M12 14v4M10 16h4" />
  </svg>
)

export const Radio = ({ size = 20 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 7.76a6 6 0 0 0 0 8.49" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
  </svg>
)

export const Building = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
  </svg>
)

export const Shield = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
)

export const Plug = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 22v-5M9 8V2M15 8V2M7 8h10v5a4 4 0 0 1-8 0V8Z" />
  </svg>
)

export const Eye = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const EyeOff = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <path d="M2 2l20 20" />
  </svg>
)

export const Send = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
)

export const MessageSquare = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
  </svg>
)

export const Medal = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15" />
    <path d="M11 12 7.21 22l3.79-5 3.79 5L14 12" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

export const FileText = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
)

export const CreditCard = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
)

export const Info = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
)

export const TrendDown = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="m23 18-9.5-9.5-5 5L1 6" />
    <path d="M17 18h6v-6" />
  </svg>
)

export const DollarSign = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

export const CalendarCheck = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="m9 16 2 2 4-4" />
  </svg>
)

export const Check = ({ size = 16 }) => (
  <svg {...base(size)}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

export const Download = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M7 10l5 5 5-5M12 15V3" />
  </svg>
)

export const Star = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
  </svg>
)

export const Activity = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

export const Lightbulb = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 1 0 12 13" />
    <path d="M12 2v1" />
  </svg>
)

export const Save = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
    <path d="M17 21v-8H7v8M7 3v5h8" />
  </svg>
)

export const Phone = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
)

export const Video = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="m23 7-7 5 7 5V7Z" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
)

export const Paperclip = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
  </svg>
)

export const ImageIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-5-5L5 21" />
  </svg>
)

export const MoreVertical = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="5" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </svg>
)

export const Bot = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="3" y="8" width="18" height="12" rx="2" />
    <path d="M12 8V4M8 4h8M9 14h.01M15 14h.01" />
  </svg>
)

export const Pin = ({ size = 14 }) => (
  <svg {...base(size)}>
    <path d="M12 17v5M9 3h6l1 7 4 2v3H4v-3l4-2 1-7Z" />
  </svg>
)

export const Smile = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
  </svg>
)

export const ClipboardList = ({ size = 20 }) => (
  <svg {...base(size)}>
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
  </svg>
)

export const UsersGroup = ({ size = 20 }) => (
  <svg {...base(size)}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
