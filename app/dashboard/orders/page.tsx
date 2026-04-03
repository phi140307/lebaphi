
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrders, updateOrderStatus, Order } from '../../../lib/orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  const [currentUser] = useState({
    id: 'user_demo_123',
    username: 'demo_user',
    email: 'demo@example.com',
  });

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, sortBy]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Thử lấy từ database trước
      const { data, error } = await getOrders(currentUser.id);
      
      if (!error && data && data.length > 0) {
        // Có dữ liệu từ database - dữ liệu đã đúng format snake_case
        setOrders(data as Order[]);
        console.log('Đã tải đơn hàng từ database:', data.length);

        // Sync với localStorage
        localStorage.setItem('user_orders', JSON.stringify(data));
      } else {
        // Không có dữ liệu từ database, lấy từ localStorage
        const savedOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
        
        if (savedOrders.length > 0) {
          // Chuyển đổi localStorage data sang snake_case format nếu cần
          const formattedOrders: Order[] = savedOrders.map((order: any) => ({
            id: order.id,
            user_id: order.user_id || order.userId,
            items: order.items || [],
            total_amount: order.total_amount || order.totalAmount,
            status: order.status,
            payment_method: order.payment_method || order.paymentMethod,
            created_at: order.created_at || order.createdAt,
            updated_at: order.updated_at || order.updatedAt,
            completed_at: order.completed_at || order.completedAt
          }));
          
          setOrders(formattedOrders);
          console.log('Đã tải đơn hàng từ localStorage:', formattedOrders.length);
        } else {
          // Không có đơn hàng nào, tạo mock data với format đúng
          const mockOrders: Order[] = [
            {
              id: 'demo_order_001',
              user_id: currentUser.id,
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
            }
          ];
          
          setOrders(mockOrders);
          console.log('Đã tạo đơn hàng demo');
        }
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      
      // Fallback với localStorage
      const savedOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      if (savedOrders.length > 0) {
        const formattedOrders: Order[] = savedOrders.map((order: any) => ({
          id: order.id,
          user_id: order.user_id || order.userId,
          items: order.items || [],
          total_amount: order.total_amount || order.totalAmount,
          status: order.status,
          payment_method: order.payment_method || order.paymentMethod,
          created_at: order.created_at || order.createdAt,
          updated_at: order.updated_at || order.updatedAt,
          completed_at: order.completed_at || order.completedAt
        }));
        
        setOrders(formattedOrders);
        console.log('Fallback: Đã tải từ localStorage');
      }
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    filtered.sort((a, b) => {
      const aValue = new Date(a.created_at).getTime();
      const bValue = new Date(b.created_at).getTime();
      return bValue - aValue;
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

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={loadOrders}
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-file-list-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <i className="ri-time-line text-yellow-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Chờ xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <i className="ri-play-circle-line text-blue-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Đang xử lý</p>
                <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <i className="ri-check-circle-line text-green-600 text-xl"></i>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Hoàn thành</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">#{order.id.slice(-8)}</div>
                      <div className="text-sm text-gray-500">{order.payment_method === 'balance' ? 'Số dư' : 'Thẻ'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{order.items.length} sản phẩm</div>
                      <div className="text-sm text-gray-500">{order.items[0]?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.total_amount.toLocaleString()}đ</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <i className="ri-eye-line"></i>
                        </Link>
                        <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                          Chỉ admin có thể thay đổi
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-file-list-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-500">Các đơn hàng sẽ hiển thị tại đây</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
