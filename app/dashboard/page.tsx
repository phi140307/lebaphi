'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserById } from '../../lib/supabase';
import CartIcon from '../../components/CartIcon';

export default function Dashboard() {
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [selectedTab, setSelectedTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showOtherServicesDropdown, setShowOtherServicesDropdown] = useState(false);
  const [showAdminPopup, setShowAdminPopup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  // Định nghĩa interface cho notification
  interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
    color: string;
    icon: string;
  }
  
  const [notifications, setNotifications] = useState<Notification[]>([
    // Khởi tạo mảng trống với type annotation
  ]);
  
  const [userStats, setUserStats] = useState({
    balance: 0,
    totalDeposit: 0,
    monthlyDeposit: 0,
    totalSpent: 0,
    rank: 'Cộng tác viên'
  });
  const [currentUser, setCurrentUser] = useState({
    id: 'user_demo_123',
    username: 'demo_user',
    email: 'demo@example.com',
    full_name: 'Lê Bá Phi'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadUserStats();
    checkForWelcomeNotification();

    // Hiển thị popup admin sau 2 giây khi vào trang
    const adminPopupTimer = setTimeout(() => {
      setShowAdminPopup(true);
    }, 2000);

    return () => clearTimeout(adminPopupTimer);
  }, []);

  const checkForWelcomeNotification = () => {
    if (typeof window === 'undefined') return;

    // Kiểm tra xem có phải vừa đăng nhập không
    const justLoggedIn = localStorage.getItem('just_logged_in');
    if (justLoggedIn === 'true') {
      setShowWelcomeNotification(true);
      // Xóa flag sau khi hiển thị
      localStorage.removeItem('just_logged_in');
      // Tự động ẩn sau 5 giây
      setTimeout(() => {
        setShowWelcomeNotification(false);
      }, 5000);
    }
  };

  const loadUserStats = async () => {
    try {
      if (typeof window === 'undefined') return;

      // Kiểm tra session người dùng
      const userSession = localStorage.getItem('user_session');
      if (userSession) {
        const userData = JSON.parse(userSession);
        setCurrentUser(userData);

        // Lấy thông tin chi tiết từ database
        const { data, error } = await getUserById(userData.id);
        if (!error && data) {
          const currentBalance = data.balance || 0;
          const totalDeposited = data.total_deposited || 0;
          const totalSpent = data.total_spent || 0;

          setUserStats({
            balance: currentBalance,
            totalDeposit: totalDeposited,
            monthlyDeposit: totalDeposited,
            totalSpent: totalSpent,
            rank: getRankByDeposit(totalDeposited)
          });

          setCurrentUser(prev => ({
            ...prev,
            full_name: data.full_name || prev.full_name,
            email: data.email || prev.email,
            username: data.username || prev.username
          }));
        }
      } else {
        // Nếu không có session, chuyển hướng về trang đăng nhập
        window.location.href = '/login';
        return;
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
      // Sử dụng dữ liệu mặc định nếu có lỗi
      setUserStats({
        balance: 0,
        totalDeposit: 0,
        monthlyDeposit: 0,
        totalSpent: 0,
        rank: 'Người dùng mới'
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankByDeposit = (totalDeposit: number): string => {
    if (totalDeposit >= 10000000) return 'Kim cương';
    if (totalDeposit >= 5000000) return 'Vàng';
    if (totalDeposit >= 1000000) return 'Bạc';
    if (totalDeposit >= 100000) return 'Đồng';
    return 'Cộng tác viên';
  };

  const getUnreadNotificationCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const markNotificationAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'system':
        return 'text-orange-600 bg-orange-100';
      case 'order':
        return 'text-green-600 bg-green-100';
      case 'account':
        return 'text-red-600 bg-red-100';
      case 'feature':
        return 'text-blue-600 bg-blue-100';
      case 'payment':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'system':
        return 'ri-tools-line';
      case 'order':
        return 'ri-check-line';
      case 'account':
        return 'ri-wallet-line';
      case 'feature':
        return 'ri-star-line';
      case 'payment':
        return 'ri-money-dollar-circle-line';
      default:
        return 'ri-notification-line';
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Điều Khoản Dịch Vụ', icon: 'ri-file-text-line' },
    { id: 'api', label: 'Tài Liệu Api', icon: 'ri-code-line' },
    { id: 'products', label: 'Mua Sản Phẩm', icon: 'ri-shopping-bag-line' },
    { id: 'bulk-products', label: 'Sản Phẩm Đã Mua', icon: 'ri-shopping-cart-line' },
    { id: 'users', label: 'Quản Lý Người Dùng', icon: 'ri-user-settings-line' },
    { id: 'new-order', label: 'Đơn Hàng Mới', icon: 'ri-add-circle-line' },
    { id: 'bulk-order', label: 'Dịch Vụ Khác', icon: 'ri-service-line' },
  ];

  const topTabs = [
    { id: 'home', label: 'Trang Chủ', icon: 'ri-home-line' },
    { id: 'notifications', label: 'Cập Nhật Gần Để', icon: 'ri-notification-line' },
  ];

  const stats = [
    {
      label: 'Số dư',
      value: loading ? '...' : `${userStats.balance.toLocaleString()} đ`,
      icon: 'ri-wallet-3-line',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      label: 'Tổng nạp',
      value: loading ? '...' : `${userStats.totalDeposit.toLocaleString()} đ`,
      icon: 'ri-add-circle-line',
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Đã tiêu',
      value: loading ? '...' : `${userStats.totalSpent.toLocaleString()} đ`,
      icon: 'ri-shopping-cart-line',
      color: 'text-red-600 bg-red-100'
    },
    {
      label: userStats.rank,
      value: 'Cấp bậc',
      icon: 'ri-vip-crown-line',
      color: 'text-purple-600 bg-purple-100'
    },
  ];

  const adminNotifications = [
    {
      title: 'ADMIN SDT : 0369842545 Lê Bá Phi',
      time: mounted ? new Date().toLocaleString('vi-VN') : '',
      messages: [
        '➡️ Nếu gặp vấn đề hãy liên hệ  zalo : 0369842545 để được giải đáp kịp thời ',
        '➡️ Quý khách hàng vui lòng đọc mô tả trước khi đặt hàng',
        '➡️ Chúng tôi không hỗ trợ xử lý vấn đề về đơn hàng nếu bạn không thực hiện như nội dung trên đây chúng tôi !!',
        '➡️ Da số các đơn dịch vụ giá rẻ tốc độ sẽ không ổn định, có thể sau rất nhiều ngày mới bắt đầu chạy | Nên mọi người cân nhắc trước khi lên đơn nhé ạ.',
        '➡️ 99% dịch vụ sẽ không cho đề đơn, hoặc nhiều dịch vụ có thể đổi liên kết | Nếu để đơn, đổi đường link trong quá trình đơn đang chạy đơn có thể chuyển sang trạng thái hoàn thành chúng tôi sẽ không hỗ trợ.',
        '➡️ Hệ thống bên mình luôn ưu tiên chất lượng nên tốc độ rất ổn định nhưng sẽ được update hàng ngày nếu nên tăng có dựt quét mạnh mình sẽ thông báo tại zalo',
        '➡️ Mọi người vui lòng test dịch vụ trước khi lên đơn nhé vì có thể nên tăng đang quét tránh delay khiến mọi người trải nghiệm không tốt !'
      ]
    }
  ];

  const recentUpdates = [
    { title: 'THÔNG BÁO', subtitle: 'Zalo hỗ trợ: 0369842545', time: '8 tháng trước', color: 'bg-blue-500' },
    { title: 'Web: lebaphi.com', subtitle: 'AUTO NẠP TIỀN SỬ DỤNG DỊCH VỤ GIÁ RẺ', time: '', color: 'bg-green-500' },
    { title: 'NẠP TIỀN QR CODE', subtitle: 'HOẶC CHUYỂN KHOẢN GHI ĐÚNG NỘI DUNG', time: '', color: 'bg-orange-500' },
    { title: 'KHÔNG ĐƯỢC NẠP TÀO HÓA ĐƠN', subtitle: '', time: '', color: 'bg-red-500' },
  ];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedMenu(categoryId);
    setShowOtherServicesDropdown(categoryId === 'bulk-order' ? !showOtherServicesDropdown : false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Popup */}
      {showAdminPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="ri-key-2-line text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Đọc Kĩ Điều Khoản Trước Khi Sử Dụng Dịch Vụ Của Chúng Tôi</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowAdminPopup(false)}
                  className="text-white/80 hover:text-white text-xl"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-4 text-base text-gray-700">
                <div className="flex items-start space-x-3">
                  <i className="ri-play-line text-blue-600 mt-1 text-lg"></i>
                  <p className="text-lg leading-relaxed">
                    <strong>Mọi người lưu ý ai mua dịch vụ về Facebook (như mở khóa 282, 956, dame acc, lên tích xanh), hoặc mở live TikTok thì liên hệ trực tiếp với mình qua Zalo 0369842545</strong>
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setShowAdminPopup(false)}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  Tôi đã đọc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Notification */}
      {showWelcomeNotification && (
        <div className="fixed top-4 right-4 left-4 md:left-auto md:right-4 z-50 animate-slide-in-right">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm mx-auto md:mx-0">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-check-line text-green-600 text-lg"></i>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Chào mừng đến với shop của Lê Bá Phi
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Xin chào <span className="font-medium text-blue-600">{currentUser.full_name}</span>, 
                  bạn đã đăng nhập thành công vào hệ thống.
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <i className="ri-time-line mr-1"></i>
                  <span suppressHydrationWarning={true}>
                    Hôm nay lúc {mounted ? new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowWelcomeNotification(false)}
                className="text-gray-400 hover:text-gray-600 flex-shrink-0"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-green-500 h-1 rounded-full animate-progress" style={{ width: '100%', animation: 'progress 5s linear' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <i className="ri-menu-line text-xl"></i>
              </button>

              <div className="flex items-center space-x-2 md:space-x-3">
                <img
                  src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/557260a0b6689a10feeaff4143aebb61.png"
                  alt="lebaphi.com"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover"
                />
                <span className="text-lg md:text-xl font-bold text-gray-900 hidden sm:block">
                  {selectedTab === 'home' ? 'Trang Chủ' : 'Cập Nhật Gần Để'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Mobile Actions */}
              <div className="flex items-center space-x-1 md:space-x-2">
                <CartIcon />

                <Link href="/dashboard/deposit" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <i className="ri-add-circle-line text-lg md:text-xl"></i>
                </Link>

                {/* Notification Button with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg relative"
                  >
                    <i className="ri-notification-line text-lg md:text-xl"></i>
                    {getUnreadNotificationCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-[10px] md:text-xs">
                        {getUnreadNotificationCount()}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotificationDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900">Thông báo</h3>
                          <div className="flex items-center space-x-2">
                            {getUnreadNotificationCount() > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Đánh dấu tất cả đã đọc
                              </button>
                            )}
                            <button
                              onClick={() => setShowNotificationDropdown(false)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <i className="ri-close-line text-lg"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.color}`}>
                                  <i className={`${notification.icon} text-sm`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                      {notification.title}
                                    </h4>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNotification(notification.id);
                                      }}
                                      className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <i className="ri-close-line text-sm"></i>
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-gray-500">{notification.time}</span>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                              <i className="ri-notification-off-line text-2xl text-gray-400"></i>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Chưa có thông báo</h3>
                            <p className="text-xs text-gray-500 mb-4">
                              Các thông báo từ hệ thống sẽ xuất hiện tại đây
                            </p>
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-xs text-blue-600">
                                <i className="ri-information-line mr-1"></i>
                                Admin sẽ gửi thông báo quan trọng cho bạn
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 text-center">
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            Xem tất cả thông báo
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* User Profile */}
              <div className="relative">
                <div className="flex items-center space-x-2 md:space-x-3">
                  <img
                    src="https://readdy.ai/api/search-image?query=professional%20Vietnamese%20businessman%20avatar%20portrait%2C%20clean%20background%2C%20modern%20business%20style%2C%20friendly%20expression&width=40&height=40&seq=avatar1&orientation=squarish"
                    alt="Avatar"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-20 md:max-w-none">{currentUser.full_name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-20 md:max-w-none">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                  >
                    <i className={`ri-arrow-down-s-line transition-transform ${showUserDropdown ? 'rotate-180' : ''}`}></i>
                  </button>
                </div>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-56 md:w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src="https://readdy.ai/api/search-image?query=professional%20Vietnamese%20businessman%20avatar%20portrait%2C%20clean%20background%2C%20modern%20business%20style%2C%20friendly%20expression&width=40&height=40&seq=avatar1&orientation=squarish"
                          alt="Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{currentUser.full_name}</p>
                          <p className="text-sm text-gray-500 truncate">{currentUser.email}</p>
                          <p className="text-xs text-green-600 mt-1">
                            <i className="ri-wallet-3-line mr-1"></i>
                            Số dư: {userStats.balance.toLocaleString()} đ
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <i className="ri-user-line mr-3 text-gray-500"></i>
                        Thông tin cá nhân
                      </Link>

                      <Link
                        href="/dashboard/deposit"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <i className="ri-add-circle-line mr-3 text-gray-500"></i>
                        Nạp tiền
                      </Link>

                      <Link
                        href="/dashboard/orders"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <i className="ri-file-list-line mr-3 text-gray-500"></i>
                        Lịch sử đơn hàng
                      </Link>

                      <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
                        <i className="ri-settings-3-line mr-3 text-gray-500"></i>
                        Cài đặt tài khoản
                      </button>
                    </div>

                    <div className="border-t border-gray-200 py-2">
                      <button
                        className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setShowUserDropdown(false);
                          if (confirm('Bạn muốn đăng xuất đúng chứ?')) {
                            localStorage.removeItem('user_session');
                            window.location.href = '/';
                          }
                        }}
                      >
                        <i className="ri-logout-circle-line mr-3"></i>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Top Navigation Tabs - Mobile Optimized */}
          <div className="border-t border-gray-200">
            <div className="px-4 md:px-6">
              <div className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
                {topTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 md:py-4 border-b-2 transition-colors whitespace-nowrap ${selectedTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                  >
                    <i className={`${tab.icon} text-lg`}></i>
                    <span className="font-medium text-sm md:text-base">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
            onClick={() => setShowMobileSidebar(false)}
          ></div>
        )}

        {/* Sidebar */}
        <aside className={`${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static top-0 left-0 w-64 bg-white shadow-sm min-h-screen border-r z-50 transition-transform duration-300 ease-in-out`}>
          {/* Mobile Sidebar Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <img
                src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/557260a0b6689a10feeaff4143aebb61.png"
                alt="lebaphi.com"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-bold text-gray-900">Menu</span>
            </div>
            <button
              onClick={() => setShowMobileSidebar(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          <div className="p-4 overflow-y-auto">
            {/* Product Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">PRODUCT</h3>
              <nav className="space-y-1">
                {menuItems.slice(2, 4).map((item) => (
                  <Link
                    key={item.id}
                    href={item.id === 'products' ? '/dashboard/products' : '/dashboard/purchased'}
                    onClick={() => {
                      setSelectedMenu(item.id);
                      setShowMobileSidebar(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${selectedMenu === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <i className={`${item.icon} text-lg ${selectedMenu === item.id ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}></i>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Management Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">MANAGEMENT</h3>
              <nav className="space-y-1">
                <Link
                  href="/admin/login"
                  onClick={() => {
                    setSelectedMenu('users');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${selectedMenu === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <i className={`ri-admin-line text-lg ${selectedMenu === 'users' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}></i>
                  <span className="text-sm font-medium">Admin Panel</span>
                </Link>

                <Link
                  href="/dashboard/orders"
                  onClick={() => {
                    setSelectedMenu('orders');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${selectedMenu === 'orders' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <i className={`ri-file-list-line text-lg ${selectedMenu === 'orders' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}></i>
                  <span className="text-sm font-medium">Quản Lý Đơn Hàng</span>
                </Link>
              </nav>
            </div>

            {/* Service Section */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">SERVICE</h3>
              <nav className="space-y-1">
                <Link
                  href="/dashboard/products"
                  onClick={() => {
                    setSelectedMenu('new-order');
                    setShowMobileSidebar(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${selectedMenu === 'new-order' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <i className={`ri-add-circle-line text-lg ${selectedMenu === 'new-order' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}></i>
                  <span className="text-sm font-medium">Đơn Hàng Mới</span>
                </Link>

                {/* Other Services Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => handleCategoryClick('bulk-order')}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group ${selectedMenu === 'bulk-order' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <i className={`ri-service-line text-lg ${selectedMenu === 'bulk-order' ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'}`}></i>
                    <span className="text-sm font-medium">Dịch Vụ Khác</span>
                    <i className={`ri-arrow-down-s-line text-sm ml-auto transition-transform ${showOtherServicesDropdown ? 'rotate-180' : ''} ${selectedMenu === 'bulk-order' ? 'text-blue-600' : 'text-gray-500'}`}></i>
                  </button>

                  {/* Dropdown Menu */}
                  {showOtherServicesDropdown && (
                    <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 pl-4">
                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        <i className="ri-facebook-fill text-lg text-blue-600"></i>
                        <div className="text-left">
                          <div className="text-sm font-medium">Mở Khoá Facebook</div>
                          <div className="text-xs text-gray-500">Mở khoá 282, 956, etc...</div>
                        </div>
                      </button>

                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        <i className="ri-shield-cross-line text-lg text-red-600"></i>
                        <div className="text-left">
                          <div className="text-sm font-medium">Dame Acc Facebook</div>
                          <div className="text-xs text-gray-500">Tấn công tài khoản đối thủ</div>
                        </div>
                      </button>

                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        <i className="ri-live-line text-lg text-gray-700"></i>
                        <div className="text-left">
                          <div className="text-sm font-medium">Mở Live TikTok</div>
                          <div className="text-xs text-gray-500">Kích hoạt tính năng live</div>
                        </div>
                      </button>

                      <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                        <i className="ri-vip-crown-line text-lg text-blue-500"></i>
                        <div className="text-left">
                          <div className="text-sm font-medium">Lên Tích Xanh</div>
                          <div className="text-xs text-gray-500">Xác thực tài khoản</div>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Social Media Section */}
            <div>
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setShowMobileSidebar(false)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group bg-blue-50 text-blue-700"
                >
                  <i className="ri-dashboard-line text-lg text-blue-600"></i>
                  <span className="text-sm font-medium">Tổng Quan</span>
                </Link>

                <Link
                  href="/dashboard/purchased"
                  onClick={() => setShowMobileSidebar(false)}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 group hover:bg-gray-50"
                >
                  <i className="ri-shopping-cart-line text-lg text-blue-600"></i>
                  <span className="text-sm font-medium">Sản Phẩm Đã Mua</span>
                </Link>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6">
          {selectedTab === 'home' ? (
            <>
              {/* Stats Cards - Mobile Optimized */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ${stat.color} mx-auto md:mx-0`}>
                        <i className={`${stat.icon} text-lg md:text-xl`}></i>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-lg md:text-2xl font-bold text-gray-900 break-words">{stat.value}</p>
                        <p className="text-xs md:text-sm text-gray-500">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions - Mobile Optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <Link href="/dashboard/deposit" className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-4 md:p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <i className="ri-add-circle-line text-xl md:text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-bold">Nạp tiền</p>
                      <p className="text-sm opacity-90">Nạp tiền vào tài khoản</p>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/products" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 md:p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <i className="ri-shopping-bag-line text-xl md:text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-bold">Mua sản phẩm</p>
                      <p className="text-sm opacity-90">Duyệt và mua dịch vụ</p>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard/orders" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-4 md:p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <i className="ri-file-list-line text-xl md:text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-bold">Đơn hàng</p>
                      <p className="text-sm opacity-90">Xem lịch sử đơn hàng</p>
                    </div>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('cart');
                        window.location.reload();
                      }
                    }
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl p-4 md:p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <i className="ri-delete-bin-line text-xl md:text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-lg md:text-xl font-bold">Xóa giỏ hàng</p>
                      <p className="text-sm opacity-90">Reset giỏ hàng về 0</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Admin Message - Mobile Optimized */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src="https://readdy.ai/api/search-image?query=professional%20admin%20avatar%2C%20Vietnamese%20businessman%2C%20clean%20background%2C%20official%20portrait%20style&width=40&height=40&seq=admin1&orientation=squarish"
                      alt="Admin"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">{adminNotifications[0].title}</h3>
                      <p className="text-xs md:text-sm text-gray-500" suppressHydrationWarning={true}>{adminNotifications[0].time}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  <div className="space-y-3 md:space-y-4">
                    {adminNotifications[0].messages.map((message, index) => (
                      <p key={index} className="text-xs md:text-sm text-gray-700 leading-relaxed">
                        {message}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 md:mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Post your comments"
                        className="flex-1 border border-gray-300 rounded-lg px-3 md:px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <button className="p-2 text-gray-500 hover:text-blue-600">
                        <i className="ri-send-plane-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Updates Tab Content - Mobile Optimized */
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-lg">Cập Nhật Gần Để</h3>
              </div>

              <div className="p-4 md:p-6">
                <div className="space-y-4 md:space-y-6">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`w-3 h-3 ${update.color} rounded-full mt-2 flex-shrink-0`}></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm md:text-base">{update.title}</h4>
                        {update.subtitle && (
                          <p className="text-sm text-gray-600 mt-1">{update.subtitle}</p>
                        )}
                        {update.time && (
                          <p className="text-xs text-gray-400 mt-1">{update.time}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Zalo hỗ trợ: 0369842545<br />
                      Web: lebaphi.com<br />
                      AUTO NẠP TIỀN SỬ DỤNG DỊCH VỤ GIÁ RẺ<br />
                      NẠP TIỀN QR CODE HOẶC CHUYỂN KHOẢN GHI ĐÚNG NỘI DUNG<br />
                      KHÔNG ĐƯỢC NẠP TÀO HÓA ĐƠN
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Click outside to close other services dropdown */}
      {showOtherServicesDropdown && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowOtherServicesDropdown(false)}
        ></div>
      )}
    </div>
  );
}