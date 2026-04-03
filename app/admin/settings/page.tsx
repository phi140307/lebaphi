'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn, getAdminSession } from '../../../lib/admin';

export default function AdminSettingsPage() {
  const [adminSession, setAdminSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('system');
  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Shop Lê Bá Phi',
    siteDescription: 'Dịch vụ SMM Panel chất lượng cao',
    adminEmail: 'phile140307@gmail.com',
    supportZalo: '0369842545',
    maintenanceMode: false,
    registrationEnabled: true,
    minDepositAmount: 10000,
    maxDepositAmount: 50000000,
    depositFee: 0,
    orderProcessingDelay: 0,
    autoApproveOrders: true
  });
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Thông báo bảo trì',
      content: 'Hệ thống sẽ bảo trì từ 2:00 - 4:00 sáng hàng ngày',
      type: 'system',
      active: true,
      createdAt: new Date().toISOString()
    }
  ]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    content: '',
    type: 'system'
  });
  const [showAddNotification, setShowAddNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push('/admin/login');
      return;
    }

    const session = getAdminSession();
    if (!session || !(session.permissions as any)?.admin_management) {
      router.push('/admin/dashboard');
      return;
    }

    setAdminSession(session);
    loadSettings();
  }, [router]);

  const loadSettings = () => {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSystemSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }

    // Load notifications
    const savedNotifications = localStorage.getItem('admin_notifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  };

  const saveSettings = () => {
    setLoading(true);
    
    try {
      localStorage.setItem('admin_settings', JSON.stringify(systemSettings));
      setMessage('Cài đặt đã được lưu thành công');
      setMessageType('success');
    } catch (error) {
      setMessage('Có lỗi xảy ra khi lưu cài đặt');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const addNotification = () => {
    if (!newNotification.title.trim() || !newNotification.content.trim()) {
      setMessage('Vui lòng điền đầy đủ thông tin thông báo');
      setMessageType('error');
      return;
    }

    const notification = {
      id: Date.now(),
      ...newNotification,
      active: true,
      createdAt: new Date().toISOString()
    };

    const updatedNotifications = [notification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));

    setNewNotification({ title: '', content: '', type: 'system' });
    setShowAddNotification(false);
    setMessage('Thông báo đã được thêm thành công');
    setMessageType('success');
  };

  const toggleNotification = (id: number) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, active: !n.active } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa thông báo này?')) {
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);
      localStorage.setItem('admin_notifications', JSON.stringify(updatedNotifications));
    }
  };

  const tabs = [
    { id: 'system', name: 'Hệ thống', icon: 'ri-settings-3-line' },
    { id: 'notifications', name: 'Thông báo', icon: 'ri-notification-line' },
    { id: 'payments', name: 'Thanh toán', icon: 'ri-money-dollar-circle-line' },
    { id: 'security', name: 'Bảo mật', icon: 'ri-shield-check-line' }
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Cài Đặt Hệ Thống</h1>
                <p className="text-sm text-gray-600">Admin: {adminSession.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <i className="ri-shield-check-line mr-1"></i>
                Super Admin
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* System Settings Tab */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Cài Đặt Hệ Thống</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên website
                      </label>
                      <input
                        type="text"
                        value={systemSettings.siteName}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email admin
                      </label>
                      <input
                        type="email"
                        value={systemSettings.adminEmail}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zalo hỗ trợ
                      </label>
                      <input
                        type="text"
                        value={systemSettings.supportZalo}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, supportZalo: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số tiền nạp tối thiểu (VNĐ)
                      </label>
                      <input
                        type="number"
                        value={systemSettings.minDepositAmount}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, minDepositAmount: parseInt(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        checked={systemSettings.maintenanceMode}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                        className="mr-3"
                      />
                      <label htmlFor="maintenanceMode" className="text-sm font-medium text-gray-700">
                        Chế độ bảo trì
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="registrationEnabled"
                        checked={systemSettings.registrationEnabled}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, registrationEnabled: e.target.checked }))}
                        className="mr-3"
                      />
                      <label htmlFor="registrationEnabled" className="text-sm font-medium text-gray-700">
                        Cho phép đăng ký tài khoản mới
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoApproveOrders"
                        checked={systemSettings.autoApproveOrders}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, autoApproveOrders: e.target.checked }))}
                        className="mr-3"
                      />
                      <label htmlFor="autoApproveOrders" className="text-sm font-medium text-gray-700">
                        Tự động duyệt đơn hàng
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={saveSettings}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                  </button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Quản Lý Thông Báo</h3>
                    <button
                      onClick={() => setShowAddNotification(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-add-line mr-2"></i>
                      Thêm thông báo
                    </button>
                  </div>

                  {/* Add Notification Modal */}
                  {showAddNotification && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm Thông Báo Mới</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Tiêu đề
                            </label>
                            <input
                              type="text"
                              value={newNotification.title}
                              onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Nhập tiêu đề thông báo..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nội dung
                            </label>
                            <textarea
                              value={newNotification.content}
                              onChange={(e) => setNewNotification(prev => ({ ...prev, content: e.target.value }))}
                              rows={4}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              placeholder="Nhập nội dung thông báo..."
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Loại thông báo
                            </label>
                            <select
                              value={newNotification.type}
                              onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-8"
                            >
                              <option value="system">Hệ thống</option>
                              <option value="promotion">Khuyến mãi</option>
                              <option value="maintenance">Bảo trì</option>
                              <option value="update">Cập nhật</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex space-x-3 mt-6">
                          <button
                            onClick={addNotification}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                          >
                            Thêm thông báo
                          </button>
                          <button
                            onClick={() => setShowAddNotification(false)}
                            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors whitespace-nowrap"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notifications List */}
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium text-gray-900">{notification.title}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                notification.type === 'system' ? 'bg-blue-100 text-blue-800' :
                                notification.type === 'promotion' ? 'bg-green-100 text-green-800' :
                                notification.type === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {notification.type}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                notification.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {notification.active ? 'Hoạt động' : 'Tạm dừng'}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{notification.content}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(notification.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => toggleNotification(notification.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                notification.active ? 'text-yellow-600 hover:bg-yellow-100' : 'text-green-600 hover:bg-green-100'
                              }`}
                            >
                              <i className={notification.active ? 'ri-pause-line' : 'ri-play-line'}></i>
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Settings Tab */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Cài Đặt Thanh Toán</h3>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="ri-information-line text-yellow-600 mr-2"></i>
                      <p className="text-yellow-800 text-sm">
                        Tính năng này đang được phát triển. Hiện tại hệ thống chỉ hỗ trợ thanh toán qua số dư tài khoản.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Cài Đặt Bảo Mật</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="ri-shield-check-line text-blue-600 mr-2"></i>
                      <p className="text-blue-800 text-sm">
                        Hệ thống đang sử dụng bảo mật cơ bản. Các tính năng bảo mật nâng cao sẽ được bổ sung trong phiên bản tới.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}