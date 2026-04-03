'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    // Mock data - trong thực tế sẽ load từ API
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Đơn hàng hoàn thành',
        message: 'Đơn hàng #12345678 đã được xử lý thành công. 1000 Like Facebook đã được giao.',
        type: 'success',
        isRead: false,
        createdAt: new Date().toISOString(),
        actionUrl: '/dashboard/orders'
      },
      {
        id: '2',
        title: 'Nạp tiền thành công',
        message: 'Bạn đã nạp thành công 500,000đ vào tài khoản. Số dư hiện tại: 1,228,000đ',
        type: 'success',
        isRead: false,
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        title: 'Khuyến mãi đặc biệt',
        message: 'Giảm 20% cho tất cả dịch vụ Instagram trong tuần này. Không bỏ lỡ cơ hội!',
        type: 'info',
        isRead: true,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '4',
        title: 'Cảnh báo số dư thấp',
        message: 'Số dư tài khoản của bạn đang thấp. Vui lòng nạp thêm tiền để tiếp tục sử dụng dịch vụ.',
        type: 'warning',
        isRead: true,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        actionUrl: '/dashboard/deposit'
      }
    ];
    
    setNotifications(mockNotifications);
    setLoading(false);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return 'ri-check-circle-line text-green-600';
      case 'warning': return 'ri-alert-line text-yellow-600';
      case 'error': return 'ri-error-warning-line text-red-600';
      default: return 'ri-information-line text-blue-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'error': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang tải thông báo...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả đã đọc'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  <i className="ri-check-double-line mr-2"></i>
                  Đánh dấu tất cả đã đọc
                </button>
              )}
              <button
                onClick={loadNotifications}
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
        <div className="max-w-4xl mx-auto">
          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tất cả ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap relative ${
                  filter === 'unread' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Chưa đọc ({unreadCount})
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  filter === 'read' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Đã đọc ({notifications.length - unreadCount})
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white border rounded-lg p-6 transition-all hover:shadow-md ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                  } ${getTypeColor(notification.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.type === 'success' ? 'bg-green-100' :
                        notification.type === 'warning' ? 'bg-yellow-100' :
                        notification.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <i className={`${getTypeIcon(notification.type)} text-lg`}></i>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className={`font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{notification.message}</p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-500">
                            {new Date(notification.createdAt).toLocaleString('vi-VN')}
                          </p>
                          
                          <div className="flex items-center space-x-2">
                            {notification.actionUrl && (
                              <Link
                                href={notification.actionUrl}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                Xem chi tiết
                              </Link>
                            )}
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-gray-500 hover:text-blue-600 text-sm"
                              >
                                Đánh dấu đã đọc
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-gray-500 hover:text-red-600"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg border p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-notification-off-line text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {filter === 'unread' ? 'Không có thông báo chưa đọc' : 
                   filter === 'read' ? 'Không có thông báo đã đọc' : 
                   'Chưa có thông báo nào'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {filter === 'all' 
                    ? 'Các thông báo về đơn hàng, nạp tiền sẽ hiển thị tại đây'
                    : `Các thông báo ${filter === 'unread' ? 'chưa đọc' : 'đã đọc'} sẽ hiển thị tại đây`
                  }
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center justify-center text-blue-600 mb-3">
                    <i className="ri-lightbulb-line mr-2 text-xl"></i>
                    <span className="font-medium">Mẹo sử dụng</span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-2">
                    <p>• Bật thông báo để nhận cập nhật nhanh nhất</p>
                    <p>• Kiểm tra thông báo thường xuyên để không bỏ lỡ ưu đãi</p>
                    <p>• Thông báo quan trọng sẽ được đánh dấu đặc biệt</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}