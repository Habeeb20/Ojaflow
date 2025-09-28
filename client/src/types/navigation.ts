import type { LucideIcon } from "lucide-react";


export interface NavItem {
  id: string;
  label: string;
  href: string;
  // icon?: ReactNode;
  icon?: LucideIcon
  badge?: string | number;
  isActive?: boolean;
  disabled?: boolean;
  children?: NavItem[];
}

export interface NavUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface NavNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export interface SearchResult {
  id: string;
  label: string;
  href: string;
  title?: string;
  category?: string;
  // TODO: more fields will be added
}

export interface NavProps {
  items: NavItem[];
  user?: NavUser;
  notifications?: NavNotification[];
  onItemClick?: (item: NavItem) => void;
  onSearch?: (query: string) => Promise<SearchResult[]>;
  onUserMenuClick?: (action: string) => void;
  onNotificationClick?: (notification: NavNotification) => void;
  className?: string;
}
