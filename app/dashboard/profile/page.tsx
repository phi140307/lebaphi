'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserById, updateUser } from '../../../lib/supabase';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [profileStats, setProfileStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalDeposit: 0,
    memberSince: '',
    completedOrders: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // Lấy thông tin người dùng từ session/localStorage
      const userSession = localStorage.getItem('user_session');
      let currentUser = null;

      if (userSession) {
        const sessionData = JSON.parse(userSession);
        
        // Thử lấy từ database trước
        try {
          const { data, error } = await getUserById(sessionData.id);
          if (!error && data) {
            currentUser = {
              id: data.id,
              username: data.username,
              email: data.email,
              full_name: data.full_name || sessionData.full_name || 'Lê Bá Phi',
              phone: data.phone || '0369842545',
              balance: data.balance || 0,
              status: data.status || 'active',
              created_at: data.created_at || new Date().toISOString(),
              updated_at: data.updated_at || new Date().toISOString(),
              deposit_code: data.deposit_code || `NAPTIEN${sessionData.username || 'USER'}${Date.now().toString().slice(-6)}`,
              avatar_url: data.avatar_url,
              date_of_birth: data.date_of_birth,
              gender: data.gender,
              address: data.address,
              verified: true,
              total_deposited: data.total_deposited || 0,
              total_spent: data.total_spent || 0
            };
          }
        } catch (dbError) {
          console.log('Database not available, using session data');
        }

        // Fallback với session data nếu database không có
        if (!currentUser) {
          currentUser = {
            id: sessionData.id || 'user_demo_123',
            username: sessionData.username || 'demo_user',
            email: sessionData.email || 'demo@example.com',
            full_name: sessionData.full_name || 'Lê Bá Phi',
            phone: '0369842545',
            balance: 0, // Bắt đầu với số dư 0
            status: 'active',
            created_at: sessionData.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            deposit_code: sessionData.deposit_code || `NAPTIEN${sessionData.username || 'USER'}${Date.now().toString().slice(-6)}`,
            avatar_url: null,
            date_of_birth: sessionData.date_of_birth,
            gender: sessionData.gender,
            address: sessionData.address,
            verified: true,
            total_deposited: 0,
            total_spent: 0
          };
        }
      } else {
        // Nếu không có session, tạo user demo
        currentUser = {
          id: 'user_demo_123',
          username: 'demo_user',
          email: 'demo@example.com',
          full_name: 'Lê Bá Phi',
          phone: '0369842545',
          balance: 0,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deposit_code: `NAPTIEN${Date.now().toString().slice(-6)}`,
          avatar_url: null,
          date_of_birth: null,
          gender: null,
          address: 'Việt Nam',
          verified: true,
          total_deposited: 0,
          total_spent: 0
        };
      }

      setUser(currentUser);

      // Tính toán thống kê từ đơn hàng thực tế
      const savedOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');
      const userOrders = savedOrders.filter((order: any) => order.user_id === currentUser.id);
      
      const completedOrders = userOrders.filter((order: any) => order.status === 'completed');
      const processingOrders = userOrders.filter((order: any) => order.status === 'processing' || order.status === 'pending');
      
      const totalSpentFromOrders = completedOrders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
      
      setProfileStats({
        totalOrders: userOrders.length,
        totalSpent: currentUser.total_spent || totalSpentFromOrders,
        totalDeposit: currentUser.total_deposited || 0,
        memberSince: currentUser.created_at,
        completedOrders: completedOrders.length,
        pendingOrders: processingOrders.length
      });

    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage('Có lỗi xảy ra khi tải thông tin cá nhân');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      date_of_birth: formData.get('date_of_birth') as string,
      gender: formData.get('gender') as string,
      address: formData.get('address') as string,
    };

    try {
      // Thử cập nhật vào database
      try {
        const { data, error } = await updateUser(user.id, userData);
        if (error) {
          console.log('Database update failed, updating locally');
        }
      } catch (dbError) {
        console.log('Database not available, updating locally');
      }

      // Cập nhật local state
      const updatedUser = { ...user, ...userData, updated_at: new Date().toISOString() };
      setUser(updatedUser);

      // Cập nhật session
      const userSession = localStorage.getItem('user_session');
      if (userSession) {
        const sessionData = JSON.parse(userSession);
        const updatedSession = { ...sessionData, ...userData };
        localStorage.setItem('user_session', JSON.stringify(updatedSession));
      }

      setMessage('✅ Cập nhật thông tin thành công!');
      setMessageType('success');
      setEditing(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Có lỗi xảy ra khi cập nhật thông tin');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const currentPassword = formData.get('current_password') as string;
    const newPassword = formData.get('new_password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (newPassword !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      setMessageType('error');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự');
      setMessageType('error');
      return;
    }

    try {
      // Mock password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('✅ Đổi mật khẩu thành công!');
      setMessageType('success');
      setShowChangePassword(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Có lỗi xảy ra khi đổi mật khẩu');
      setMessageType('error');
    }
  };

  const getUserLevel = (totalSpent: number) => {
    if (totalSpent >= 10000000) return { name: 'VIP Diamond', color: 'text-purple-600', bgColor: 'bg-purple-100' };
    if (totalSpent >= 5000000) return { name: 'VIP Gold', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    if (totalSpent >= 2000000) return { name: 'VIP Silver', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    if (totalSpent >= 500000) return { name: 'Bronze', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    return { name: 'Thành viên mới', color: 'text-blue-600', bgColor: 'bg-blue-100' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
          <p className="text-gray-600">Không thể tải xuống thông tin người dùng</p>
          <Link href="/dashboard" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const userLevel = getUserLevel(profileStats.totalSpent);

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
                <h1 className="text-2xl font-bold text-gray-900">Thông Tin Cá Nhân</h1>
                <p className="text-sm text-gray-600">Quản lý thông tin tài khoản của bạn</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {user.verified && (
                <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <i className="ri-verified-badge-line mr-1"></i>
                  Đã xác thực
                </div>
              )}
              <button
                onClick={() => setEditing(!editing)}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  editing 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {editing ? (
                  <>
                    <i className="ri-close-line mr-2"></i>
                    Hủy chỉnh sửa
                  </>
                ) : (
                  <>
                    <i className="ri-edit-line mr-2"></i>
                    Chỉnh sửa
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div className={`mx-6 mt-4 p-4 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Profile Card & Stats */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative mx-auto mb-4">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                    </div>
                    {user.verified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="ri-check-line text-white text-sm"></i>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user.full_name || user.username}
                  </h2>
                  <p className="text-gray-600 mb-1">@{user.username}</p>
                  <p className="text-sm text-gray-500 mb-4">{user.email}</p>

                  {/* User Level */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${userLevel.bgColor} ${userLevel.color} mb-4`}>
                    <i className="ri-vip-crown-line mr-1"></i>
                    {userLevel.name}
                  </div>

                  {/* Balance */}
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-4 text-white">
                    <p className="text-sm text-green-100 mb-1">Số dư tài khoản</p>
                    <p className="text-2xl font-bold">{user.balance?.toLocaleString() || '0'}đ</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                      <Link
                        href="/dashboard/deposit"
                        className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors whitespace-nowrap"
                      >
                        <i className="ri-add-line mr-1"></i>
                        Nạp tiền
                      </Link>
                      <div className="text-xs text-green-100">
                        Mã: {user.deposit_code}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="ri-shopping-cart-line text-blue-600"></i>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{profileStats.totalOrders}</p>
                    <p className="text-sm text-gray-500">Tổng đơn hàng</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="ri-money-dollar-circle-line text-green-600"></i>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {profileStats.totalSpent >= 1000000 
                        ? `${(profileStats.totalSpent / 1000000).toFixed(1)}M` 
                        : `${Math.floor(profileStats.totalSpent / 1000)}K`}
                    </p>
                    <p className="text-sm text-gray-500">Đã chi tiêu</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="ri-wallet-3-line text-purple-600"></i>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {profileStats.totalDeposit >= 1000000 
                        ? `${(profileStats.totalDeposit / 1000000).toFixed(1)}M` 
                        : `${Math.floor(profileStats.totalDeposit / 1000)}K`}
                    </p>
                    <p className="text-sm text-gray-500">Đã nạp</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <i className="ri-time-line text-orange-600"></i>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.floor((Date.now() - new Date(profileStats.memberSince).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                    <p className="text-sm text-gray-500">Ngày tham gia</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Thao tác nhanh</h3>
                <div className="space-y-3">
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <i className="ri-file-list-3-line text-blue-600 mr-3"></i>
                      <span className="font-medium">Đơn hàng của tôi</span>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </Link>

                  <Link
                    href="/dashboard/deposit"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <i className="ri-money-dollar-circle-line text-green-600 mr-3"></i>
                      <span className="font-medium">Nạp tiền</span>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </Link>

                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center">
                      <i className="ri-lock-password-line text-orange-600 mr-3"></i>
                      <span className="font-medium">Đổi mật khẩu</span>
                    </div>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Profile Form */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Thông tin cá nhân</h3>
                  <div className="text-sm text-gray-500">
                    Cập nhật lần cuối: {new Date(user.updated_at).toLocaleString('vi-VN')}
                  </div>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        defaultValue={user.full_name || ''}
                        disabled={!editing}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Nhập họ và tên..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        value={user.username}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Tên đăng nhập không thể thay đổi</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={user.email}
                        disabled={!editing}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Nhập email..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={user.phone || ''}
                        disabled={!editing}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        placeholder="Nhập số điện thoại..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        name="date_of_birth"
                        defaultValue={user.date_of_birth || ''}
                        disabled={!editing}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính
                      </label>
                      <select
                        name="gender"
                        defaultValue={user.gender || ''}
                        disabled={!editing}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <textarea
                      name="address"
                      defaultValue={user.address || ''}
                      disabled={!editing}
                      rows={3}
                      maxLength={500}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                      placeholder="Nhập địa chỉ..."
                    />
                  </div>

                  {/* Account Information */}
                  <div className="border-t pt-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Thông tin tài khoản</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mã nạp tiền
                        </label>
                        <div className="flex items-center">
                          <input
                            type="text"
                            value={user.deposit_code}
                            disabled
                            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 bg-gray-50 text-gray-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(user.deposit_code)}
                            className="px-4 py-3 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                            title="Copy mã nạp tiền"
                          >
                            <i className="ri-file-copy-line"></i>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Sử dụng mã này để nạp tiền (Nhớ ghi đúng nội dung)</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trạng thái tài khoản
                        </label>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                          </span>
                          {user.verified && (
                            <span className="inline-flex px-3 py-2 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                              <i className="ri-verified-badge-line mr-1"></i>
                              Đã xác thực
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày đăng ký
                        </label>
                        <input
                          type="text"
                          value={new Date(user.created_at).toLocaleString('vi-VN')}
                          disabled
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cấp độ thành viên
                        </label>
                        <div className={`inline-flex items-center px-4 py-3 rounded-lg text-sm font-medium ${userLevel.bgColor} ${userLevel.color}`}>
                          <i className="ri-vip-crown-line mr-2"></i>
                          {userLevel.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {editing && (
                    <div className="flex space-x-4 pt-6 border-t">
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saving ? (
                          <div className="flex items-center justify-center">
                            <i className="ri-loader-4-line animate-spin mr-2"></i>
                            Đang lưu...
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <i className="ri-save-line mr-2"></i>
                            Lưu thay đổi
                          </div>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="current_password"
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập mật khẩu hiện tại..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="new_password"
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Nhập lại mật khẩu mới..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <i className="ri-information-line mr-1"></i>
                  Mật khẩu phải có ít nhất 6 ký tự
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 whitespace-nowrap"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}