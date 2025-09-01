export interface MenuItem {
  name: string;
  icon: string;
  route: string;
  badge?: string;
  children?: MenuItem[];
  permissions?: string[];
}

export interface LayoutConfig {
  sidebarOpen: boolean;
  darkMode: boolean;
  compactMode: boolean;
  animations: boolean;
}

export interface BreadcrumbItem {
  label: string;
  route?: string;
  active?: boolean;
  icon?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}
