'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn, getAdminSession } from '../../../lib/admin';
import { getOrders, updateOrderStatus, Order } from '../../../lib/orders';
import { getUsers } from '../../../lib/supabase';

export default function AdminOrdersPage() {
  const [adminSession, setAdminSession] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [processingOrder, setProcessingOrder] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push('/admin/login');
      return;
    }

    const session = getAdminSession();
    if (!session || !session.permissions?.orders) {
      router.push('/admin/login');
      return;
    }

    setAdminSession(session);
    loadData();
  }, [router]);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter, sortBy, sortOrder]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersResult, usersResult] = await Promise.all([
        getOrders(),
        getUsers()
      ]);

      let allOrders: Order[] = [];

      if (!ordersResult.error && ordersResult.data) {
        const dbOrders: Order[] = ordersResult.data.map((order: any) => ({
          id: order.id,
          user_id: order.user_id,
          items: order.items || [],
          total_amount: order.total_amount,
          status: order.status,
          payment_method: order.payment_method,
          created_at: order.created_at,
          updated_at: order.updated_at,
          completed_at: order.completed_at
        }));
        allOrders = [...dbOrders];
        console.log('Loaded orders from database:', dbOrders.length);
      }

      try {
        const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        console.log('Found local orders:', localOrders.length);

        if (localOrders.length > 0) {
          const formattedLocalOrders: Order[] = localOrders.map((order: any) => ({
            id: order.id,
            user_id: order.user_id || order.userId || 'user_demo_123',
            items: order.items || [],
            total_amount: order.total_amount || order.totalAmount,
            status: order.status,
            payment_method: order.payment_method || order.paymentMethod,
            created_at: order.created_at || order.createdAt,
            updated_at: order.updated_at || order.updatedAt,
            completed_at: order.completed_at || order.completedAt
          }));

          formattedLocalOrders.forEach((localOrder: Order) => {
            const existingOrder = allOrders.find(order => order.id === localOrder.id);
            if (!existingOrder) {
              allOrders.push(localOrder);
            }
          });
        }
      } catch (localError) {
        console.log('No local orders found or error reading:', localError);
      }

      allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setOrders(allOrders);
      console.log('Total orders loaded:', allOrders.length);

      if (!usersResult.error && usersResult.data) {
        setUsers(usersResult.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);

      try {
        const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        if (localOrders.length > 0) {
          const formattedOrders: Order[] = localOrders.map((order: any) => ({
            id: order.id,
            user_id: order.user_id || order.userId || 'user_demo_123',
            items: order.items || [],
            total_amount: order.total_amount || order.totalAmount,
            status: order.status,
            payment_method: order.payment_method || order.paymentMethod,
            created_at: order.created_at || order.createdAt,
            updated_at: order.updated_at || order.updatedAt,
            completed_at: order.completed_at || order.completedAt
          }));

          setOrders(formattedOrders);
          console.log('Fallback: loaded from localStorage:', formattedOrders.length);
        } else {
          const demoOrder: Order = {
            id: 'demo_order_001',
            user_id: 'user_demo_123',
            items: [
              {
                id: '1',
                productId: 1,
                name: 'Facebook Like Việt Nam - Thật 100%',
                price: 8,
                quantity: 1000,
                category: 'facebook',
                targetUrl: 'https://facebook.com/page1',
                notes: 'Đơn hàng demo'
              }
            ],
            total_amount: 8000,
            status: 'processing' as const,
            payment_method: 'balance' as const,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          setOrders([demoOrder]);
          console.log('Created demo order for admin view');
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    setProcessingOrder(orderId);
    try {
      const { error } = await updateOrderStatus(orderId, newStatus);
      if (error) {
        console.log('Database update error:', error.message);
      } else {
        console.log('✅ Database updated successfully');
      }

      try {
        const localOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        const updatedLocalOrders = localOrders.map((order: any) => {
          if (order.id === orderId) {
            const updated = {
              ...order,
              status: newStatus,
              updated_at: new Date().toISOString()
            };

            if (newStatus === 'completed') {
              updated.completed_at = new Date().toISOString();
            }

            return updated;
          }
          return order;
        });

        localStorage.setItem('user_orders', JSON.stringify(updatedLocalOrders));
        console.log('✅ localStorage updated successfully');
      } catch (localError) {
        console.log('LocalStorage update error:', localError);
      }

      loadData();

      alert('✅ Cập nhật trạng thái thành công');
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Có lỗi xảy ra khi cập nhật trạng thái');
    } finally {
      setProcessingOrder(null);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_method === paymentFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(order => {
        const user = users.find(u => u.id === order.user_id);
        return (
          order.id.toLowerCase().includes(term) ||
          (user && (
            user.username.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
          )) ||
          order.items.some(item =>
            item.name.toLowerCase().includes(term) || item.category.toLowerCase().includes(term)
          )
        );
      });
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy as keyof Order] || '';
      let bValue = b[sortBy as keyof Order] || '';

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const getUserInfo = (userId: string) => {
    return users.find(u => u.id === userId);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    failed: orders.filter(o => o.status === 'failed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.total_amount || 0), 0),
    todayOrders: orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!adminSession) {
    return null;
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Quản Lý Đơn Hàng</h1>
                <p className="text-sm text-gray-600">Admin: {adminSession.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                <i className="ri-shopping-cart-line mr-1"></i>
                {stats.total} đơn hàng
              </div>
              <button
                onClick={loadData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-refresh-line mr-2"></i>
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-shopping-bag-line text-blue-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Tổng đơn</p>
                <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="ri-time-line text-yellow-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Chờ xử lý</p>
                <p className="text-lg font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-settings-line text-blue-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Đang xử lý</p>
                <p className="text-lg font-bold text-gray-900">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-line text-green-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Hoàn thành</p>
                <p className="text-lg font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-close-line text-gray-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Đã hủy</p>
                <p className="text-lg font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <i className="ri-error-warning-line text-red-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Thất bại</p>
                <p className="text-lg font-bold text-gray-900">{stats.failed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-purple-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Doanh thu</p>
                <p className="text-sm font-bold text-gray-900">{stats.totalRevenue.toLocaleString()}đ</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <i className="ri-calendar-line text-indigo-600"></i>
              </div>
              <div className="ml-3">
                <p className="text-xs text-gray-500">Hôm nay</p>
                <p className="text-lg font-bold text-gray-900">{stats.todayOrders}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
                <option value="failed">Thất bại</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="all">Tất cả thanh toán</option>
                <option value="balance">Số dư</option>
                <option value="sepay">SePay</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="created_at">Ngày tạo</option>
                <option value="updated_at">Ngày cập nhật</option>
                <option value="total_amount">Tổng tiền</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <i className={`ri-sort-${sortOrder === 'asc' ? 'asc' : 'desc'}-line`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const user = getUserInfo(order.user_id);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">#{order.id.slice(-8)}</div>
                        <div className="text-xs text-gray-500">{order.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="ri-user-line text-blue-600 text-sm"></i>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{user?.username || 'N/A'}</div>
                            <div className="text-xs text-gray-500">{user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{order.items.length} sản phẩm</div>
                        <div className="text-xs text-gray-500">
                          {order.items.slice(0, 2).map(item => item.name).join(', ')}
                          {order.items.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{(order.total_amount || 0).toLocaleString()}đ</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.payment_method === 'balance'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {order.payment_method === 'balance' ? 'Số dư' : 'Thẻ tín dụng'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div suppressHydrationWarning={true}>
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-400" suppressHydrationWarning={true}>
                          {new Date(order.created_at).toLocaleTimeString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetail(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title="Xem chi tiết"
                          >
                            <i className="ri-eye-line"></i>
                          </button>

                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusUpdate(order.id, e.target.value as Order['status'])
                              }
                              disabled={processingOrder === order.id}
                              className="text-xs border border-gray-300 rounded px-2 py-1 pr-6 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            >
                              <option value="pending">Chờ xử lý</option>
                              <option value="processing">Đang xử lý</option>
                              <option value="completed">Hoàn thành</option>
                              <option value="cancelled">Hủy đơn</option>
                              <option value="failed">Thất bại</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-shopping-cart-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-gray-500">Thử điều chỉnh bộ lọc tìm kiếm</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Chi tiết đơn hàng #{selectedOrder.id.slice(-8)}</h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Thông tin đơn hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mã đơn hàng:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tổng tiền:</span>
                      <span className="font-medium text-lg">{(selectedOrder.total_amount || 0).toLocaleString()}đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phương thức thanh toán:</span>
                      <span className="font-medium">
                        {selectedOrder.payment_method === 'balance' ? 'Số dư tài khoản' : 'Thẻ tín dụng'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span className="font-medium" suppressHydrationWarning={true}>
                        {new Date(selectedOrder.created_at).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    {selectedOrder.completed_at && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày hoàn thành:</span>
                        <span className="font-medium" suppressHydrationWarning={true}>
                          {new Date(selectedOrder.completed_at).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Thông tin khách hàng</h4>
                  {(() => {
                    const user = getUserInfo(selectedOrder.user_id);
                    return user ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tên đăng nhập:</span>
                          <span className="font-medium">{user.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Họ tên:</span>
                          <span className="font-medium">{user.full_name || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Số điện thoại:</span>
                          <span className="font-medium">{user.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Số dư hiện tại:</span>
                          <span className="font-medium">{((user.balance || 0)).toLocaleString()}đ</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">Không tìm thấy thông tin khách hàng</p>
                    );
                  })()}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Danh sách sản phẩm</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <p className="text-sm text-gray-600 mt-1">Platform: {item.category?.toUpperCase()}</p>
                          <p className="text-sm text-gray-600">URL: {item.targetUrl}</p>
                          {item.notes && <p className="text-sm text-gray-600 mt-1">Ghi chú: {item.notes}</p>}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm text-gray-500">Số lượng: {(item.quantity || 0).toLocaleString()}</div>
                          <div className="text-sm text-gray-500">Đơn giá: {item.price || 0}đ</div>
                          <div className="font-medium text-gray-900">Thành tiền: {((item.price || 0) * (item.quantity || 0)).toLocaleString()}đ</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-4">Cập nhật trạng thái</h4>
                  <div className="flex space-x-3">
                    {['processing', 'completed', 'cancelled', 'failed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedOrder.id, status as Order['status'])}
                        disabled={processingOrder === selectedOrder.id}
                        className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                          status === 'completed'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : status === 'processing'
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : status === 'cancelled'
                            ? 'bg-gray-600 text-white hover:bg-gray-700'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {processingOrder === selectedOrder.id ? (
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                        ) : null}
                        {getStatusText(status)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}