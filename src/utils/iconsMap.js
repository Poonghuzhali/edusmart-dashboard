import * as Icons from '../icons.jsx'

const map = {
  GradCap: Icons.GradCap,
  Users: Icons.Users,
  Book: Icons.Book,
  Rupee: Icons.Rupee,
  CheckCircle: Icons.CheckCircle,
  Bell: Icons.Bell,
  Warning: Icons.Warning,
  XCircle: Icons.XCircle,
  Lock: Icons.Lock,
  Grid: Icons.Grid,
  CalendarCheck: Icons.CalendarCheck,
  BarChart: Icons.BarChart,
  Folder: Icons.Folder,
  Settings: Icons.Settings,
  ClipboardList: Icons.ClipboardList,
  Clock: Icons.Clock,
  Wallet: Icons.Wallet,
  DollarSign: Icons.DollarSign,
  TrendDown: Icons.TrendDown,
  TrendUp: Icons.TrendUp,
  Activity: Icons.Activity,
  UsersGroup: Icons.UsersGroup,
  Building: Icons.Building,
  Medal: Icons.Medal,
  Shield: Icons.Shield,
  Info: Icons.Info,
  Mail: Icons.Mail,
  MessageSquare: Icons.MessageSquare,
  Send: Icons.Send,
  Radio: Icons.Radio,
  Megaphone: Icons.Megaphone,
}

export function resolveIcon(name, fallback = Icons.Info) {
  return map[name] || fallback
}
