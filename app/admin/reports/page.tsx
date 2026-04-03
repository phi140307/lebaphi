'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn, getAdminSession } from '../../../lib/admin';

interface ReportData {
  revenue: {
    today: number;
    yesterday: number;
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
  };
  orders: {
    today: number;
    yesterday: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
    completed: number;
  };
  users: {
    total: number;
    active: number;
    newToday: number;
    newThisWeek: number;
  };
  services: {
    facebook: { orders: number; revenue: number };
    instagram: { orders: number; revenue: number };
    tiktok: { orders: number; revenue: number };
    youtube: { orders: number; revenue: number };
  };
}

export default function AdminReportsPage() {
  const [adminSession, setAdminSession] = useState<any>(null);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('thisMonth');
  const [chartType, setChartType] = useState('revenue');
  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push('/admin/login');
      return;
    }

    const session = getAdminSession();
    if (!session) {
      router.push('/admin/login');
      return;
    }

    setAdminSession(session);
    loadReportData();
  }, [router]);

  const loadReportData = () => {
    // Mock data - trong thực tế sẽ load từ database
    const mockData: ReportData = {
      revenue: {
        today: 1250000,
        yesterday: 980000,
        thisWeek: 8500000,
        thisMonth: 32000000,
        lastMonth: 28500000
      },
      orders: {
        today: 45,
        yesterday: 38,
        thisWeek: 285,
        thisMonth: 1180,
        pending: 23,
        completed: 1157
      },
      users: {
        total: 2847,
        active: 1923,
        newToday: 12,
        newThisWeek: 89
      },
      services: {
        facebook: { orders: 485, revenue: 12500000 },
        instagram: { orders: 392, revenue: 9800000 },
        tiktok: { orders: 203, revenue: 6200000 },
        youtube: { orders: 100, revenue: 3500000 }
      }
    };

    setReportData(mockData);
    setLoading(false);
  };

  const exportReport = (format: 'excel' | 'pdf') => {
    // Mock export functionality
    alert(`Đang xuất báo cáo định dạng ${format.toUpperCase()}...`);
  };

  if (!adminSession || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  const revenueGrowth = ((reportData.revenue.thisMonth - reportData.revenue.lastMonth) / reportData.revenue.lastMonth * 100).toFixed(1);
  const orderGrowth = ((reportData.orders.today - reportData.orders.yesterday) / reportData.orders.yesterday * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Báo Cáo & Thống Kê</h1>
                <p className="text-sm text-gray-600">Admin: {adminSession.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <i className="ri-shield-check-line mr-1"></i>
                Admin Mode
              </div>
              <button
                onClick={() => exportReport('excel')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-file-excel-line mr-2"></i>
                Xuất Excel
              </button>
              <button
                onClick={() => exportReport('pdf')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-file-pdf-line mr-2"></i>
                Xuất PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Date Filter */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Khoảng thời gian:</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="today">Hôm nay</option>
                  <option value="thisWeek">Tuần này</option>
                  <option value="thisMonth">Tháng này</option>
                  <option value="lastMonth">Tháng trước</option>
                  <option value="custom">Tùy chọn</option>
                </select>
              </div>
              
              <button
                onClick={loadReportData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-refresh-line mr-2"></i>
                Làm mới
              </button>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Doanh thu hôm nay</p>
                  <p className="text-3xl font-bold">{reportData.revenue.today.toLocaleString()}đ</p>
                  <div className="flex items-center mt-2">
                    <i className={`ri-arrow-${parseFloat(orderGrowth) > 0 ? 'up' : 'down'}-line mr-1`}></i>
                    <span className="text-sm">{orderGrowth}% so với hôm qua</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-3xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Doanh thu tháng này</p>
                  <p className="text-3xl font-bold">{reportData.revenue.thisMonth.toLocaleString()}đ</p>
                  <div className="flex items-center mt-2">
                    <i className={`ri-arrow-${parseFloat(revenueGrowth) > 0 ? 'up' : 'down'}-line mr-1`}></i>
                    <span className="text-sm">{revenueGrowth}% so với tháng trước</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-line-chart-line text-3xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Đơn hàng hôm nay</p>
                  <p className="text-3xl font-bold">{reportData.orders.today}</p>
                  <div className="flex items-center mt-2">
                    <i className="ri-shopping-cart-line mr-1"></i>
                    <span className="text-sm">{reportData.orders.completed} hoàn thành</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-file-list-line text-3xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Người dùng hoạt động</p>
                  <p className="text-3xl font-bold">{reportData.users.active}</p>
                  <div className="flex items-center mt-2">
                    <i className="ri-user-add-line mr-1"></i>
                    <span className="text-sm">{reportData.users.newToday} mới hôm nay</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <i className="ri-group-line text-3xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Biểu đồ doanh thu</h3>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  <option value="revenue">Doanh thu</option>
                  <option value="orders">Đơn hàng</option>
                  <option value="users">Người dùng</option>
                </select>
              </div>
              
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <i className="ri-bar-chart-line text-4xl text-gray-400 mb-2"></i>
                  <p className="text-gray-500">Biểu đồ sẽ hiển thị ở đây</p>
                  <p className="text-sm text-gray-400">Tích hợp thư viện chart như Recharts</p>
                </div>
              </div>
            </div>

            {/* Service Performance */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Hiệu suất theo dịch vụ</h3>
              
              <div className="space-y-4">
                {Object.entries(reportData.services).map(([service, data]) => {
                  const total = Object.values(reportData.services).reduce((sum, s) => sum + s.revenue, 0);
                  const percentage = ((data.revenue / total) * 100).toFixed(1);
                  
                  return (
                    <div key={service} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            service === 'facebook' ? 'bg-blue-100' :
                            service === 'instagram' ? 'bg-pink-100' :
                            service === 'tiktok' ? 'bg-gray-100' : 'bg-red-100'
                          }`}>
                            <i className={`${
                              service === 'facebook' ? 'ri-facebook-fill text-blue-600' :
                              service === 'instagram' ? 'ri-instagram-line text-pink-600' :
                              service === 'tiktok' ? 'ri-tiktok-line text-gray-700' : 'ri-youtube-line text-red-600'
                            } text-lg`}></i>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 capitalize">{service}</h4>
                            <p className="text-sm text-gray-600">{data.orders} đơn hàng</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{data.revenue.toLocaleString()}đ</p>
                          <p className="text-sm text-gray-600">{percentage}%</p>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            service === 'facebook' ? 'bg-blue-600' :
                            service === 'instagram' ? 'bg-pink-600' :
                            service === 'tiktok' ? 'bg-gray-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Stats Tables */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Sản phẩm bán chạy</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Facebook Like</p>
                      <p className="text-sm text-gray-600">125 đơn hàng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">3,250,000đ</p>
                    <p className="text-sm text-green-600">↑ 15.2%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Instagram Follower</p>
                      <p className="text-sm text-gray-600">98 đơn hàng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">2,890,000đ</p>
                    <p className="text-sm text-green-600">↑ 8.7%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">TikTok View</p>
                      <p className="text-sm text-gray-600">76 đơn hàng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">1,980,000đ</p>
                    <p className="text-sm text-red-600">↓ 3.1%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Hoạt động gần đây</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-check-line text-green-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">Đơn hàng #12345678 đã hoàn thành</p>
                    <p className="text-xs text-gray-500">2 phút trước</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-user-add-line text-blue-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">Người dùng mới đăng ký: user_123</p>
                    <p className="text-xs text-gray-500">5 phút trước</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="ri-money-dollar-circle-line text-yellow-600 text-sm"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">Nạp tiền thành công: 500,000đ</p>
                    <p className="text-xs text-gray-500">8 phút trước</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  href="/admin/dashboard"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Xem tất cả hoạt động →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}