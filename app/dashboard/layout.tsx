'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === 'undefined') return;

      const userSession = localStorage.getItem('user_session');
      if (!userSession) {
        // Nếu không có session, chuyển hướng về trang đăng nhập
        router.push('/login');
        return;
      }

      try {
        const userData = JSON.parse(userSession);
        const now = Date.now();
        const loginTime = userData.loginTime || 0;
        const sessionDuration = 24 * 60 * 60 * 1000; // 24 giờ

        if (now - loginTime > sessionDuration) {
          // Session đã hết hạn
          localStorage.removeItem('user_session');
          router.push('/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user session:', error);
        localStorage.removeItem('user_session');
        router.push('/login');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang kiểm tra phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router sẽ chuyển hướng
  }

  return <>{children}</>;
}