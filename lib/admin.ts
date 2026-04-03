
export interface AdminUser {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  permissions: {
    dashboard: boolean;
    users: boolean;
    orders: boolean;
    deposits: boolean;
    reports: boolean;
    settings: boolean;
  };
  created_at?: string;
  last_login?: string;
}

export interface AdminSession {
  id: string;
  username: string;
  email: string;
  role: string;
  permissions: {
    dashboard: boolean;
    users: boolean;
    orders: boolean;
    deposits: boolean;
    reports: boolean;
    settings: boolean;
  };
  loginTime: string;
  expiresAt: string;
}

export const ADMIN_ACCOUNTS: AdminUser[] = [
  {
    id: 'admin_1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@lebaphi.com',
    role: 'super_admin',
    permissions: {
      dashboard: true,
      users: true,
      orders: true,
      deposits: true,
      reports: true,
      settings: true,
    },
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 'admin_2',
    username: 'moderator',
    password: 'mod123',
    email: 'mod@lebaphi.com',
    role: 'moderator',
    permissions: {
      dashboard: true,
      users: true,
      orders: true,
      deposits: false,
      reports: true,
      settings: false,
    },
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const isAdminLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const session = localStorage.getItem('admin_session');
    if (!session) return false;
    
    const adminSession = JSON.parse(session);
    
    // Kiểm tra hết hạn
    if (adminSession.expiresAt && new Date(adminSession.expiresAt) < new Date()) {
      localStorage.removeItem('admin_session');
      return false;
    }
    
    return !!(adminSession && adminSession.id && adminSession.username);
  } catch (error) {
    return false;
  }
};

export const getAdminSession = (): AdminSession | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const session = localStorage.getItem('admin_session');
    if (!session) return null;
    
    const adminSession = JSON.parse(session);
    
    // Kiểm tra hết hạn
    if (adminSession.expiresAt && new Date(adminSession.expiresAt) < new Date()) {
      localStorage.removeItem('admin_session');
      return null;
    }
    
    return adminSession;
  } catch (error) {
    return null;
  }
};

export const loginAdmin = (username: string, password: string): AdminSession | null => {
  const admin = ADMIN_ACCOUNTS.find(
    acc => acc.username === username && acc.password === password
  );

  if (admin) {
    const session: AdminSession = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions,
      loginTime: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_session', JSON.stringify(session));
    }
    return session;
  }

  return null;
};

// Thêm các alias và export bổ sung
export const adminLogin = loginAdmin;

export const logoutAdmin = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_session');
  }
};

export const setAdminSession = (session: AdminSession): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('admin_session', JSON.stringify(session));
};

export const clearAdminSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('admin_session');
};

// Thêm các function export bổ sung mà TypeScript yêu cầu
export const getCurrentAdmin = (): AdminSession | null => {
  return getAdminSession();
};

export const hasPermission = (permission: keyof AdminSession['permissions']): boolean => {
  const session = getAdminSession();
  return session?.permissions?.[permission] || false;
};

export const isLoggedIn = isAdminLoggedIn;
export const logout = logoutAdmin;
