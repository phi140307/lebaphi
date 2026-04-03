
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOrders } from '../../../lib/orders';

export default function PurchasedProductsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'processing' | 'pending'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentUser] = useState({
    id: 'user_demo_123',
    username: 'demo_user',
    email: 'demo@example.com',
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await getOrders(currentUser.id);

      if (!error && data) {
        setOrders(data);
      } else {
        // Mock data for demo
        const mockOrders = [
          {
            id: 'order_001',
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
                notes: 'Tăng like nhanh chóng'
              },
              {
                id: '2',
                productId: 5,
                name: 'Instagram Follower Thật - Không Drop',
                price: 12,
                quantity: 500,
                category: 'instagram',
                targetUrl: 'https://instagram.com/profile1',
                notes: 'Follower chất lượng cao'
              }
            ],
            total_amount: 14000,
            status: 'completed',
            payment_method: 'balance',
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T11:00:00Z',
            completed_at: '2024-01-15T11:00:00Z'
          },
          {
            id: 'order_002',
            user_id: currentUser.id,
            items: [
              {
                id: '3',
                productId: 10,
                name: 'TikTok View Việt Nam - Tốc Độ Cao',
                price: 3,
                quantity: 5000,
                category: 'tiktok',
                targetUrl: 'https://tiktok.com/@user1/video/123',
                notes: 'Tăng view viral'
              }
            ],
            total_amount: 15000,
            status: 'processing', // Giữ trạng thái processing
            payment_method: 'balance',
            created_at: '2024-01-14T15:20:00Z',
            updated_at: '2024-01-14T16:00:00Z'
          },
          {
            id: 'order_003',
            user_id: currentUser.id,
            items: [
              {
                id: '4',
                productId: 3,
                name: 'Facebook Share Bài Viết - Tăng Tương Tác',
                price: 15,
                quantity: 200,
                category: 'facebook',
                targetUrl: 'https://facebook.com/post123',
                notes: 'Share organic'
              },
              {
                id: '5',
                productId: 8,
                name: 'Instagram Comment Việt Nam - Có Ý Nghĩa',
                price: 25,
                quantity: 100,
                category: 'instagram',
                targetUrl: 'https://instagram.com/p/ABC123/',
                notes: 'Comment tích cực'
              }
            ],
            total_amount: 5500,
            status: 'processing', // Thay đổi từ pending sang processing
            payment_method: 'balance',
            created_at: '2024-01-13T09:15:00Z',
            updated_at: '2024-01-13T09:15:00Z'
          }
        ];
        setOrders(mockOrders);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'facebook':
        return 'ri-facebook-fill text-blue-600';
      case 'instagram':
        return 'ri-instagram-line text-pink-600';
      case 'tiktok':
        return 'ri-tiktok-line text-gray-700';
      case 'youtube':
        return 'ri-youtube-line text-red-600';
      default:
        return 'ri-apps-line text-gray-600';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item: any) => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesFilter && matchesSearch;
  });

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);

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
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sản Phẩm Đã Mua</h1>
                <p className="text-sm text-gray-600">Quản lý đơn hàng và theo dõi tiến độ</p>
              </div>
            </div>

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

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-shopping-bag-line text-blue-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-check-line text-green-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="ri-time-line text-yellow-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Đang xử lý</p>
                  <p className="text-2xl font-bold text-gray-900">{processingOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="ri-money-dollar-circle-line text-purple-600 text-xl"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Tổng chi tiêu</p>
                  <p className="text-2xl font-bold text-gray-900">{totalSpent.toLocaleString()}đ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tất cả ({totalOrders})
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Hoàn thành ({completedOrders})
                </button>
                <button
                  onClick={() => setFilter('processing')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === 'processing'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Đang xử lý ({processingOrders})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    filter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Chờ xử lý ({orders.filter(o => o.status === 'pending').length})
                </button>
              </div>

              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm đơn hàng..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full lg:w-80"
                />
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-bold text-gray-900">
                          Đơn hàng #{order.id.slice(-8)}
                        </h3>
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {order.total_amount.toLocaleString()}đ
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item: any) => (
                        <div key={item.id} className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            item.category === 'facebook'
                              ? 'bg-blue-100'
                              : item.category === 'instagram'
                              ? 'bg-pink-100'
                              : item.category === 'tiktok'
                              ? 'bg-gray-100'
                              : 'bg-gray-100'
                          }`}>
                            <i className={`${getCategoryIcon(item.category)} text-lg`}></i>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-2 truncate">
                              <i className="ri-link mr-1"></i>
                              {item.targetUrl}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Số lượng: <strong>{item.quantity.toLocaleString()}</strong></span>
                              <span>Đơn giá: <strong>{item.price}đ</strong></span>
                              <span>Tổng: <strong className="text-blue-600">{(item.price * item.quantity).toLocaleString()}đ</strong></span>
                            </div>
                            {item.notes && (
                              <p className="text-sm text-gray-600 mt-2">
                                <i className="ri-sticky-note-line mr-1"></i>
                                {item.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col space-y-2">
                            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium whitespace-nowrap">
                              <i className="ri-eye-line mr-1"></i>
                              Chi tiết
                            </button>
                            {order.status === 'completed' && (
                              <button className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium whitespace-nowrap">
                                <i className="ri-repeat-line mr-1"></i>
                                Mua lại
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-6">
                          <span>
                            <i className="ri-calendar-line mr-1"></i>
                            Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
                          </span>
                          <span>
                            <i className="ri-wallet-3-line mr-1"></i>
                            Thanh toán: {order.payment_method === 'balance' ? 'Số dư' : 'Thẻ tín dụng'}
                          </span>
                          {order.completed_at && (
                            <span>
                              <i className="ri-check-line mr-1"></i>
                              Hoàn thành: {new Date(order.completed_at).toLocaleString('vi-VN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
                <i className="ri-shopping-bag-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm || filter !== 'all' ? 'Không tìm thấy đơn hàng nào' : 'Chưa có đơn hàng nào'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || filter !== 'all'
                    ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                    : 'Bắt đầu mua sắm ngay để tăng tương tác cho tài khoản của bạn'
                  }
                </p>
                <Link
                  href="/dashboard/products"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Mua sản phẩm ngay
                </Link>
              </div>
            )}
          </div>

          {/* Load More */}
          {filteredOrders.length > 10 && (
            <div className="text-center mt-8">
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium whitespace-nowrap">
                <i className="ri-arrow-down-line mr-2"></i>
                Xem thêm đơn hàng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
