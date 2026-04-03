'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn, getAdminSession, logoutAdmin } from '../../../lib/admin';
import { getUsers } from '../../../lib/supabase';

export default function AdminDashboard() {
  const [adminSession, setAdminSession] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    suspendedUsers: 0,
    todayRegistrations: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra đăng nhập admin
    if (!isAdminLoggedIn()) {
      router.push('/admin/login');
      return;
    }

    const session = getAdminSession();
    setAdminSession(session);
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const { data: users, error } = await getUsers();
      
      if (!error && users) {
        const today = new Date().toDateString();
        const todayRegistrations = users.filter(user => 
          new Date(user.created_at).toDateString() === today
        ).length;

        setStats({
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'active').length,
          inactiveUsers: users.filter(u => u.status === 'inactive').length,
          suspendedUsers: users.filter(u => u.status === 'suspended').length,
          todayRegistrations
        });
      }
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  const menuItems = [
    {
      title: 'Quản Lý Người Dùng',
      description: 'Xem, chỉnh sửa thông tin người dùng',
      icon: 'ri-user-settings-line',
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Quản Lý Nạp Tiền',
      description: 'Xử lý yêu cầu nạp tiền, cập nhật số dư',
      icon: 'ri-money-dollar-circle-line',
      href: '/admin/deposits',
      color: 'bg-green-500'
    },
    {
      title: 'Quản Lý Đơn Hàng',
      description: 'Theo dõi và xử lý đơn hàng',
      icon: 'ri-shopping-cart-line',
      href: '/admin/orders',
      color: 'bg-orange-500'
    },
    {
      title: 'Báo Cáo Thống Kê',
      description: 'Xem báo cáo chi tiết hệ thống',
      icon: 'ri-bar-chart-line',
      href: '/admin/reports',
      color: 'bg-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!adminSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <i className="ri-admin-line text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Hệ thống quản lý</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminSession.username}</p>
                <p className="text-xs text-gray-500 capitalize">{adminSession.role}</p>
              </div>
              
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-user-line text-blue-600"></i>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-logout-circle-line mr-2"></i>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-user-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Tổng người dùng</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-pause-line text-gray-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Không hoạt động</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactiveUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="ri-forbid-line text-red-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Bị khóa</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.suspendedUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="ri-calendar-line text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Đăng ký hôm nay</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.todayRegistrations}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <i className={`${item.icon} text-white text-2xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thao Tác Nhanh</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/users">
                <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                  <i className="ri-user-add-line text-blue-600 text-xl mr-3"></i>
                  <div>
                    <div className="font-medium text-gray-900">Quản lý người dùng</div>
                    <div className="text-sm text-gray-600">Xem danh sách và chỉnh sửa</div>
                  </div>
                </div>
              </Link>

              <Link href="/admin/deposits">
                <div className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                  <i className="ri-money-dollar-circle-line text-green-600 text-xl mr-3"></i>
                  <div>
                    <div className="font-medium text-gray-900">Xử lý nạp tiền</div>
                    <div className="text-sm text-gray-600">Cập nhật số dư khách hàng</div>
                  </div>
                </div>
              </Link>

              <button 
                onClick={loadStats}
                className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
              >
                <i className="ri-refresh-line text-purple-600 text-xl mr-3"></i>
                <div>
                  <div className="font-medium text-gray-900">Làm mới dữ liệu</div>
                  <div className="text-sm text-gray-600">Cập nhật thống kê mới nhất</div>
                </div>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <div className="flex items-start space-x-3">
              <i className="ri-shield-check-line text-yellow-600 text-xl mt-0.5"></i>
              <div>
                <h3 className="font-medium text-yellow-900 mb-2">Lưu ý bảo mật</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Chỉ tài khoản admin mới có quyền truy cập trang này</li>
                  <li>• Phiên đăng nhập sẽ tự động hết hạn sau 24 giờ</li>
                  <li>• Vui lòng đăng xuất khi hoàn thành công việc</li>
                  <li>• Không chia sẻ thông tin đăng nhập với người khác</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}