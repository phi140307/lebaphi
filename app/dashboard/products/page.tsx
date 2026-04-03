'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserById } from '../../../lib/supabase';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: 'user_demo_123',
    username: 'demo_user',
    email: 'demo@example.com',
    full_name: null,
    balance: 0
  });
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Lấy thông tin người dùng từ localStorage
      const userSession = localStorage.getItem('user_session');
      if (userSession) {
        const userData = JSON.parse(userSession);
        setCurrentUser(userData);

        // Thử lấy số dư từ database
        try {
          const { data, error } = await getUserById(userData.id);
          if (!error && data) {
            setUserBalance(data.balance || 0);
            setCurrentUser(prev => ({ 
              ...prev,
              ...data,
              balance: data.balance || 0
            }));
            // Cập nhật localStorage với số dư mới nhất
            userData.balance = data.balance || 0;
            userData.full_name = data.full_name || userData.full_name;
            localStorage.setItem('user_session', JSON.stringify(userData));
          } else {
            // Fallback từ session nếu không lấy được từ DB
            setUserBalance(userData.balance || 0);
          }
        } catch (dbError) {
          console.log('Không thể kết nối database, sử dụng dữ liệu local');
          setUserBalance(userData.balance || 0);
        }
      } else {
        // Không có session, tạo demo user với số dư 100k
        const demoBalance = 100000;
        const demoUser = {
          id: 'user_demo_123',
          username: 'demo_user',
          email: 'demo@example.com',
          full_name: 'Demo User',
          balance: demoBalance
        };

        setUserBalance(demoBalance);
        setCurrentUser(demoUser);
        localStorage.setItem('user_session', JSON.stringify(demoUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback với demo user
      const demoBalance = 100000;
      const demoUser = {
        id: 'user_demo_123',
        username: 'demo_user',
        email: 'demo@example.com',
        full_name: 'Demo User',
        balance: demoBalance
      };

      setUserBalance(demoBalance);
      setCurrentUser(demoUser);
      localStorage.setItem('user_session', JSON.stringify(demoUser));
    } finally {
      setLoading(false);
    }
  };

  // Lấy chữ cái đầu cho avatar
  const getInitials = (user: any) => {
    if (user.full_name) {
      return user.full_name.charAt(0).toUpperCase();
    }
    return user.username.charAt(0).toUpperCase();
  };

  // Lấy tên hiển thị
  const getDisplayName = (user: any) => {
    return user.full_name || user.username;
  };

  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'ri-apps-line' },
    { id: 'facebook', name: 'Facebook', icon: 'ri-facebook-fill' },
    { id: 'instagram', name: 'Instagram', icon: 'ri-instagram-line' },
    { id: 'tiktok', name: 'TikTok', icon: 'ri-tiktok-line' },
    { id: 'youtube', name: 'YouTube', icon: 'ri-youtube-line' },
    { id: 'telegram', name: 'Telegram', icon: 'ri-telegram-line' },
    { id: 'shopee', name: 'Shopee', icon: 'ri-shopping-bag-line' },
    { id: 'premium', name: 'Tài khoản Premium', icon: 'ri-vip-crown-line' },
    { id: 'software', name: 'Phần mềm', icon: 'ri-computer-line' },
    { id: 'netflix', name: 'Netflix & Streaming', icon: 'ri-tv-line' },
    { id: 'design', name: 'Thiết kế', icon: 'ri-palette-line' },
    { id: 'ai', name: 'AI Tools', icon: 'ri-robot-line' },
    { id: 'microsoft', name: 'Microsoft', icon: 'ri-microsoft-line' },
  ];

  const products = [
    {
      id: 1,
      name: 'Like TikTok Việt Nam',
      category: 'tiktok',
      price: 22,
      originalPrice: 33,
      minOrder: 100,
      maxOrder: 500000,
      speed: '0-30 phút',
      quality: 'Cao',
      description: 'Like TikTok Việt Nam chất lượng cao, tăng nhanh không rớt. Phù hợp cho video mới và cần tăng tương tác nhanh.',
      status: 'active',
      discount: 33
    },
    {
      id: 2,
      name: 'Follow TikTok Real',
      category: 'tiktok',
      price: 179,
      originalPrice: 268,
      minOrder: 100,
      maxOrder: 100000,
      speed: '0-1 giờ',
      quality: 'Cao',
      description: 'Follow TikTok từ tài khoản thật 100%, không rớt, có avatar và hoạt động. Tăng uy tín profile.',
      status: 'active',
      discount: 33
    },
    {
      id: 3,
      name: 'View TikTok Việt Nam',
      category: 'tiktok',
      price: 1,
      originalPrice: 2,
      minOrder: 100,
      maxOrder: 10000000,
      speed: '0-15 phút',
      quality: 'Trung bình',
      description: 'View TikTok Việt Nam giá rẻ nhất thị trường, tốc độ cực nhanh. Thích hợp cho video cần nhiều lượt xem.',
      status: 'active',
      discount: 50
    },
    {
      id: 4,
      name: 'Share TikTok',
      category: 'tiktok',
      price: 6,
      originalPrice: 9,
      minOrder: 100,
      maxOrder: 200000,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Share TikTok tăng độ lan truyền video, giúp video được nhiều người xem hơn. Chia sẻ từ tài khoản thật.',
      status: 'active',
      discount: 33
    },
    {
      id: 5,
      name: 'Comment TikTok Việt Nam',
      category: 'tiktok',
      price: 143,
      originalPrice: 214,
      minOrder: 100,
      maxOrder: 5000,
      speed: '0-6 giờ',
      quality: 'Cao',
      description: 'Comment TikTok từ tài khoản Việt Nam thật, nội dung tích cực phù hợp. Tăng tương tác chất lượng.',
      status: 'active',
      discount: 33
    },

    {
      id: 6,
      name: 'Like Facebook Việt Nam',
      category: 'facebook',
      price: 44,
      originalPrice: 66,
      minOrder: 100,
      maxOrder: 100000,
      speed: '0-1 giờ',
      quality: 'Cao',
      description: 'Tăng like bài viết Facebook chất lượng cao, tốc độ nhanh. Tăng tương tác cho bài viết Facebook của bạn.',
      status: 'active',
      discount: 33
    },
    {
      id: 7,
      name: 'Follow Facebook Page',
      category: 'facebook',
      price: 54,
      originalPrice: 81,
      minOrder: 100,
      maxOrder: 50000,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Follow Facebook Page từ tài khoản thật, tăng lượng theo dõi fanpage nhanh chóng.',
      status: 'active',
      discount: 33
    },
    {
      id: 8,
      name: 'Share Facebook',
      category: 'facebook',
      price: 58,
      originalPrice: 87,
      minOrder: 100,
      maxOrder: 50000,
      speed: '0-3 giờ',
      quality: 'Trung bình',
      description: 'Tăng chia sẻ bài viết Facebook nhanh chóng, hiệu quả. Tăng độ lan truyền bài viết.',
      status: 'active',
      discount: 33
    },

    {
      id: 9,
      name: 'Follow Instagram Real',
      category: 'instagram',
      price: 55,
      originalPrice: 82,
      minOrder: 100,
      maxOrder: 50000,
      speed: '0-6 giờ',
      quality: 'Cao',
      description: 'Follow Instagram thật 100%, không rớt. Tăng follower Instagram chất lượng cao.',
      status: 'active',
      discount: 33
    },
    {
      id: 10,
      name: 'Like Instagram',
      category: 'instagram',
      price: 33,
      originalPrice: 49,
      minOrder: 100,
      maxOrder: 200000,
      speed: '0-1 giờ',
      quality: 'Cao',
      description: 'Like Instagram nhanh chóng, tăng tương tác cho bài đăng Instagram.',
      status: 'active',
      discount: 33
    },
    {
      id: 11,
      name: 'View Instagram Story',
      category: 'instagram',
      price: 2,
      originalPrice: 3,
      minOrder: 100,
      maxOrder: 100000,
      speed: '0-30 phút',
      quality: 'Trung bình',
      description: 'View Instagram Story tăng lượt xem story, giúp tăng reach tự nhiên.',
      status: 'active',
      discount: 33
    },

    {
      id: 12,
      name: 'Subscribe YouTube',
      category: 'youtube',
      price: 456,
      originalPrice: 681,
      minOrder: 100,
      maxOrder: 10000,
      speed: '0-12 giờ',
      quality: 'Cao',
      description: 'Subscribe YouTube chất lượng cao, bảo hành không rớt. Tăng subscriber nhanh.',
      status: 'active',
      discount: 33
    },
    {
      id: 13,
      name: 'Like YouTube',
      category: 'youtube',
      price: 77,
      originalPrice: 115,
      minOrder: 100,
      maxOrder: 50000,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Like YouTube tăng tương tác video, giúp video được đề xuất nhiều hơn.',
      status: 'active',
      discount: 33
    },
    {
      id: 14,
      name: 'View YouTube',
      category: 'youtube',
      price: 85,
      originalPrice: 127,
      minOrder: 100,
      maxOrder: 1000000,
      speed: '0-1 giờ',
      quality: 'Trung bình',
      description: 'View YouTube tăng lượt xem video nhanh chóng, giá cả phải chăng.',
      status: 'active',
      discount: 33
    },

    {
      id: 15,
      name: 'Member Telegram',
      category: 'telegram',
      price: 55,
      originalPrice: 82,
      minOrder: 100,
      maxOrder: 20000,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Member Telegram thật, hoạt động tích cực. Tăng thành viên group/channel.',
      status: 'active',
      discount: 33
    },
    {
      id: 16,
      name: 'View Telegram Post',
      category: 'telegram',
      price: 2,
      originalPrice: 3,
      minOrder: 100,
      maxOrder: 100000,
      speed: '0-1 giờ',
      quality: 'Cao',
      description: 'View bài đăng Telegram tăng lượt xem nội dung trong channel.',
      status: 'active',
      discount: 33
    },

    {
      id: 17,
      name: 'Follow Twitter',
      category: 'twitter',
      price: 6,
      originalPrice: 9,
      minOrder: 100,
      maxOrder: 30000,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Follow Twitter từ tài khoản thật, tăng follower Twitter chất lượng.',
      status: 'active',
      discount: 33
    },
    {
      id: 18,
      name: 'Like Twitter',
      category: 'twitter',
      price: 3,
      originalPrice: 4,
      minOrder: 100,
      maxOrder: 100000,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Like Twitter tăng tương tác tweet, giúp tweet được nhiều người thấy hơn.',
      status: 'active',
      discount: 25
    },
    {
      id: 19,
      name: 'Retweet Twitter',
      category: 'twitter',
      price: 4,
      originalPrice: 6,
      minOrder: 100,
      maxOrder: 50000,
      speed: '0-3 giờ',
      quality: 'Cao',
      description: 'Retweet Twitter tăng độ lan truyền tweet, chia sẻ từ tài khoản thật.',
      status: 'active',
      discount: 33
    },

    {
      id: 20,
      name: 'Follow Shop Shopee',
      category: 'shopee',
      price: 165,
      originalPrice: 247,
      minOrder: 100,
      maxOrder: 10000,
      speed: '0-8 giờ',
      quality: 'Cao',
      description: 'Follow shop Shopee tăng lượt theo dõi cửa hàng, nâng cao uy tín bán hàng.',
      status: 'active',
      discount: 33
    },
    {
      id: 21,
      name: 'Like Sản Phẩm Shopee',
      category: 'shopee',
      price: 30,
      originalPrice: 45,
      minOrder: 100,
      maxOrder: 20000,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Like sản phẩm Shopee tăng tương tác, giúp sản phẩm được ưu tiên hiển thị.',
      status: 'active',
      discount: 33
    },

    {
      id: 22,
      name: 'ChatGPT Plus',
      category: 'premium',
      price: 199000,
      originalPrice: 250000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản ChatGPT Plus 3 tháng, nâng cấp từ email bạn. Bảo hành full thời gian sử dụng.',
      status: 'active',
      discount: 20
    },
    {
      id: 23,
      name: 'Canva Pro (1 năm)',
      category: 'design',
      price: 77000,
      originalPrice: 110000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-24 giờ',
      quality: 'Cao',
      description: 'Tài khoản Canva Pro 1 năm, nâng cấp từ email của bạn. Bảo hành full năm.',
      status: 'active',
      discount: 30
    },
    {
      id: 24,
      name: 'Canva Pro (Vĩnh viễn)',
      category: 'design',
      price: 119000,
      originalPrice: 178500,
      minOrder: 1,
      maxOrder: 3,
      speed: '0-24 giờ',
      quality: 'Cao',
      description: 'Tài khoản Canva Pro vĩnh viễn, nâng cấp từ email của bạn. Bảo hành full vĩnh viễn.',
      status: 'active',
      discount: 33
    },
    {
      id: 25,
      name: 'Spotify Premium (1 tháng)',
      category: 'premium',
      price: 44000,
      originalPrice: 59000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Spotify Premium 1 tháng, nâng cấp từ email của bạn. Bảo hành full tháng.',
      status: 'active',
      discount: 25
    },
    {
      id: 26,
      name: 'Spotify Premium (3 tháng)',
      category: 'premium',
      price: 139000,
      originalPrice: 177000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Spotify Premium 3 tháng, nâng cấp từ email của bạn. Bảo hành full 3 tháng.',
      status: 'active',
      discount: 21
    },
    {
      id: 27,
      name: 'Spotify Premium (1 năm)',
      category: 'premium',
      price: 369000,
      originalPrice: 500000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Spotify Premium 1 năm, nâng cấp từ email của bạn. Bảo hành full năm.',
      status: 'active',
      discount: 26
    },
    {
      id: 28,
      name: 'CapCut Pro (1 tháng)',
      category: 'software',
      price: 55555,
      originalPrice: 75000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-6 giờ',
      quality: 'Cao',
      description: 'Tài khoản CapCut Pro 1 tháng, 3 thiết bị sử dụng. Bảo hành full tháng.',
      status: 'active',
      discount: 26
    },
    {
      id: 29,
      name: 'CapCut Pro (6 tháng)',
      category: 'software',
      price: 333333,
      originalPrice: 450000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-6 giờ',
      quality: 'Cao',
      description: 'Tài khoản CapCut Pro 6 tháng, 3 thiết bị sử dụng. Bảo hành full 6 tháng.',
      status: 'active',
      discount: 26
    },
    {
      id: 30,
      name: 'CapCut Pro (1 năm)',
      category: 'software',
      price: 369000,
      originalPrice: 525000,
      minOrder: 1,
      maxOrder: 3,
      speed: '0-8 giờ',
      quality: 'Cao',
      description: 'Tài khoản CapCut Pro 1 năm, 1 máy sử dụng. Bảo hành full năm.',
      status: 'active',
      discount: 30
    },
    {
      id: 31,
      name: 'ChatGPT Plus (1 tháng)',
      category: 'ai',
      price: 129000,
      originalPrice: 200000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản ChatGPT Plus 1 tháng, 1 máy sử dụng. Chung với nhiều người.',
      status: 'active',
      discount: 35
    },
    {
      id: 32,
      name: 'ChatGPT Plus (2 tháng)',
      category: 'ai',
      price: 250000,
      originalPrice: 400000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản ChatGPT Plus 2 tháng, 2 máy sử dụng. Chung với ít người.',
      status: 'active',
      discount: 37
    },
    {
      id: 33,
      name: 'Kling AI (Gói Standard) 39000 tín',
      category: 'ai',
      price: 2000000,
      originalPrice: 3000000,
      minOrder: 1,
      maxOrder: 3,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Kling AI gói Standard 39000 tín dùng dựng riêng từ 1 máy.',
      status: 'active',
      discount: 33
    },
    {
      id: 34,
      name: 'Kling AI (Gói Standard) 10000 tín',
      category: 'ai',
      price: 600000,
      originalPrice: 900000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Kling AI gói Standard 10000 tín dùng dựng riêng từ. Bảo hành full thời gian.',
      status: 'active',
      discount: 33
    },
    {
      id: 35,
      name: 'Leonardo (Artisan Ultimate)',
      category: 'ai',
      price: 250000,
      originalPrice: 375000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-6 giờ',
      quality: 'Cao',
      description: 'Tài khoản Leonardo Artisan Ultimate 1 tháng, 1 máy sử dụng. Chung với ít người.',
      status: 'active',
      discount: 33
    },
    {
      id: 36,
      name: 'Leonardo (Gói Meatro)',
      category: 'ai',
      price: 300000,
      originalPrice: 450000,
      minOrder: 1,
      maxOrder: 3,
      speed: '0-6 giờ',
      quality: 'Cao',
      description: 'Tài khoản Leonardo gói Meatro 1 tháng, 1 máy sử dụng. Chung với ít người.',
      status: 'active',
      discount: 33
    },
    {
      id: 37,
      name: 'YT Premium (Family)',
      category: 'youtube',
      price: 28000,
      originalPrice: 42000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản YouTube Premium Family 1 tháng, nâng cấp từ email của bạn. Riêng tư.',
      status: 'active',
      discount: 33
    },
    {
      id: 38,
      name: 'Netflix Standard (Xài đổi khi bị out)',
      category: 'netflix',
      price: 35000,
      originalPrice: 52500,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Netflix hàng Farm loại standard, 1 thiết bị. Chung với nhiều người.',
      status: 'active',
      discount: 33
    },
    {
      id: 39,
      name: 'Netflix Premium (Xài đổi khi bị out)',
      category: 'netflix',
      price: 50000,
      originalPrice: 75000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Netflix hàng Farm loại premium, 1 thiết bị. Chung với ít người.',
      status: 'active',
      discount: 33
    },
    {
      id: 40,
      name: 'Netflix 4K Ultra HD',
      category: 'netflix',
      price: 88000,
      originalPrice: 132000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Netflix chính chủ dùng riêng từ ultra HD 4K, 1 tháng, 1 thiết bị.',
      status: 'active',
      discount: 33
    },
    {
      id: 41,
      name: 'VEO3 1K Credit',
      category: 'ai',
      price: 35000,
      originalPrice: 52500,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản VEO3 1K Credit dùng chính chủ, 1 tháng, 1 thiết bị. Riêng tư.',
      status: 'active',
      discount: 33
    },
    {
      id: 42,
      name: 'Locket Gold (Cam kết không định lịch)',
      category: 'premium',
      price: 46000,
      originalPrice: 67500,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Locket Gold cam kết không định lịch, 1 tháng, 1 thiết bị. Riêng tư.',
      status: 'active',
      discount: 32
    },
    {
      id: 43,
      name: 'Grok Premium',
      category: 'ai',
      price: 500000,
      originalPrice: 750000,
      minOrder: 1,
      maxOrder: 3,
      speed: '0-6 giờ',
      quality: 'Cao',
      description: 'Tài khoản Grok Premium 1 tháng, nâng cấp từ email của bạn. Riêng tư.',
      status: 'active',
      discount: 33
    },
    {
      id: 44,
      name: 'Microsoft Office 1TB',
      category: 'microsoft',
      price: 300000,
      originalPrice: 450000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-8 giờ',
      quality: 'Cao',
      description: 'Nâng cấp Microsoft 1 năm 1TB full bộ Office, nâng cấp từ email của bạn.',
      status: 'active',
      discount: 33
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        const priceA = typeof a.price === 'number' ? a.price : parseInt(String(a.price).replace(/[^0-9]/g, '')) || 0;
        const priceB = typeof b.price === 'number' ? b.price : parseInt(String(b.price).replace(/[^0-9]/g, '')) || 0;
        return priceA - priceB;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'discount':
        return b.discount - a.discount;
      default:
        return 0;
    }
  });

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowMobileFilters(false);
    if (categoryId === 'facebook') {
      setTimeout(() => {
        const productGrid = document.querySelector('[data-products-grid]');
        if (productGrid) {
          productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  if (loading) {
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-sm sticky top-0 z-50">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/557260a0b6689a10feeaff4143aebb61.png" 
              alt="Lê Bá Phi Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover"
            />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 rounded-sm border-0 focus:ring-2 focus:ring-purple-300 outline-none text-sm"
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-3 py-1.5 rounded-sm text-sm hover:bg-purple-700">
                Tìm
              </button>
            </div>
            
            <Link href="/dashboard/cart" className="relative p-2 text-white hover:text-purple-200">
              <i className="ri-shopping-cart-line text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                0
              </span>
            </Link>

            <div className="relative">
              <button 
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex items-center space-x-2 text-white hover:text-purple-200"
              >
                <i className="ri-user-line text-xl"></i>
                <span className="hidden sm:block text-sm">Tài khoản</span>
              </button>

              {/* Account Dropdown */}
              {showAccountDropdown && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {getInitials(currentUser)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getDisplayName(currentUser)}</p>
                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 p-2 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <i className="ri-wallet-3-line mr-1"></i>
                        Số dư: <span className="font-medium">{userBalance.toLocaleString()}đ</span>
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      <i className="ri-user-line mr-3 text-gray-500"></i>
                      <span>Thông tin cá nhân</span>
                    </Link>

                    <Link
                      href="/dashboard/orders"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      <i className="ri-file-list-3-line mr-3 text-gray-500"></i>
                      <span>Đơn hàng của tôi</span>
                    </Link>

                    <Link
                      href="/dashboard/deposit"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      <i className="ri-money-dollar-circle-line mr-3 text-gray-500"></i>
                      <span>Nạp tiền</span>
                    </Link>

                    <Link
                      href="/dashboard/notifications"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      <i className="ri-notification-3-line mr-3 text-gray-500"></i>
                      <span>Thông báo</span>
                    </Link>

                    <Link
                      href="/dashboard/support"
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      <i className="ri-customer-service-2-line mr-3 text-gray-500"></i>
                      <span>Hỗ trợ</span>
                    </Link>

                    <div className="border-t my-2"></div>

                    <Link
                      href="/login"
                      className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50"
                      onClick={() => setShowAccountDropdown(false)}
                    >
                      <i className="ri-logout-circle-line mr-3"></i>
                      <span>Đăng xuất</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6 text-white text-sm">
            <Link href="/dashboard" className="hover:text-purple-200">Trang chủ</Link>
            <Link href="/dashboard/products" className="hover:text-purple-200 font-medium">Sản phẩm</Link>
            <Link href="/dashboard/orders" className="hover:text-purple-200">Đơn hàng</Link>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showAccountDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowAccountDropdown(false)}
        ></div>
      )}

      <div className="lg:hidden bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center space-x-2 text-gray-600"
          >
            <i className="ri-filter-line"></i>
            <span className="text-sm">Lọc</span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}  
            className="border border-gray-300 rounded px-3 py-1.5 text-sm pr-8 outline-none"
          >
            <option value="name">Phổ biến</option>
            <option value="price">Giá thấp - cao</option>
            <option value="discount">Giảm giá</option>
          </select>
        </div>
      </div>

      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}>
          <div className="bg-white w-4/5 h-full p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Danh mục</h3>
              <button onClick={() => setShowMobileFilters(false)} className="text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded text-left ${selectedCategory === category.id ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <i className={`${category.icon} text-lg`}></i>
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        <aside className="hidden lg:block w-64 bg-white min-h-screen border-r">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
              <i className="ri-menu-line mr-2"></i>
              DANH MỤC
            </h3>
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left transition-colors ${selectedCategory === category.id ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'}`}
                >
                  <i className={`${category.icon} text-base`}></i>
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 bg-gray-50">
          <div className="bg-white px-4 py-2 border-b">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/dashboard" className="hover:text-purple-600">Trang chủ</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span>Sản phẩm</span>
              {selectedCategory !== 'all' && (
                <>
                  <i className="ri-arrow-right-s-line"></i>
                  <span className="text-purple-600">{categories.find(c => c.id === selectedCategory)?.name}</span>
                </>
              )}
            </div>
          </div>

          {selectedCategory !== 'all' && (
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 mb-4 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <i className={`${categories.find(c => c.id === selectedCategory)?.icon} text-2xl`}></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-purple-100">
                    {sortedProducts.length} sản phẩm có sẵn
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3" data-products-grid>
              {sortedProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* TikTok Products - Sử dụng hình ảnh mới */}
                      {product.category === 'tiktok' && (
                        <img
                          src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/74dc4a4dce6861ebcc79aa07c1ab0b14.png"
                          alt={product.name}
                          className="w-full h-full object-contain p-4"
                        />
                      )}
                      
                      {/* Facebook Products */}
                      {product.category === 'facebook' && product.id === 6 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Facebook%20like%20button%20thumbs%20up%20social%20media%20engagement%20blue%20icon%20modern%20design%20digital%20interaction%20social%20network%20clean%20minimalist%20background%20professional%20sleek%20interface%20user%20engagement&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'facebook' && product.id === 7 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Facebook%20page%20follow%20button%20social%20media%20fanpage%20business%20page%20digital%20marketing%20blue%20interface%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20engagement&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'facebook' && product.id === 8 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Facebook%20share%20button%20social%20media%20viral%20content%20sharing%20blue%20interface%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20digital%20engagement&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Instagram Products */}
                      {product.category === 'instagram' && product.id === 9 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Instagram%20follow%20button%20pink%20gradient%20social%20media%20followers%20engagement%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20interface%20user%20growth&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'instagram' && product.id === 10 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Instagram%20like%20heart%20button%20pink%20gradient%20social%20media%20engagement%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20interface%20user%20interaction&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'instagram' && product.id === 11 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Instagram%20story%20views%20eye%20icon%20pink%20gradient%20social%20media%20engagement%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20interface%20user%20interaction&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* YouTube Products */}
                      {product.category === 'youtube' && product.id === 12 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=YouTube%20subscribe%20button%20red%20play%20button%20video%20platform%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20content%20creator%20channel%20growth&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'youtube' && product.id === 13 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=YouTube%20like%20thumbs%20up%20button%20red%20video%20platform%20engagement%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20content%20interaction&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'youtube' && product.id === 14 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=YouTube%20video%20views%20play%20button%20red%20counter%20statistics%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20content%20analytics&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'youtube' && product.id === 37 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=YouTube%20Premium%20logo%20red%20play%20button%20premium%20service%20ad-free%20video%20streaming%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20entertainment&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Telegram Products */}
                      {product.category === 'telegram' && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Telegram%20messaging%20app%20blue%20airplane%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20communication%20social%20media%20platform&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Shopee Products */}
                      {product.category === 'shopee' && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Shopee%20online%20shopping%20platform%20orange%20logo%20e-commerce%20marketplace%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20retail%20store&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Premium Account Products */}
                      {product.category === 'premium' && product.id === 22 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=ChatGPT%20artificial%20intelligence%20AI%20chatbot%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20assistant%20OpenAI&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'premium' && (product.id === 25 || product.id === 26 || product.id === 27) && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Spotify%20music%20streaming%20platform%20green%20logo%20premium%20service%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20entertainment%20audio&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'premium' && product.id === 42 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Locket%20Gold%20premium%20app%20widget%20photo%20sharing%20modern%20design%20clean%20minimalist%20background%20professional%20mobile%20application%20golden%20premium%20service&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Design Products - Canva */}
                      {product.category === 'design' && (product.id === 23 || product.id === 24) && (
                        <img
                          src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/d85a64c4610bb2bdbb8d01a2e3cc28ab.png"
                          alt="Canva Logo"
                          className="w-full h-full object-contain p-4"
                        />
                      )}

                      {/* Software Products - CapCut */}
                      {product.category === 'software' && (product.id === 28 || product.id === 29 || product.id === 30) && (
                        <img
                          src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/0a9282b6d6e94800abba3307d6371f07.png"
                          alt="CapCut Logo"
                          className="w-full h-full object-contain p-4"
                        />
                      )}

                      {/* Netflix Products */}
                      {product.category === 'netflix' && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Netflix%20streaming%20service%20red%20logo%20movie%20entertainment%20platform%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20video%20streaming&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* AI Tools */}
                      {product.category === 'ai' && product.id === 31 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=ChatGPT%20Plus%20artificial%20intelligence%20premium%20AI%20chatbot%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20assistant&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'ai' && product.id === 32 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=ChatGPT%20Plus%20artificial%20intelligence%20premium%20AI%20chatbot%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20assistant&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'ai' && (product.id === 33 || product.id === 34) && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Kling%20AI%20video%20generation%20artificial%20intelligence%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20creation%20tool&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'ai' && (product.id === 35 || product.id === 36) && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Leonardo%20AI%20art%20generation%20artificial%20intelligence%20creative%20tool%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20art%20creation&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'ai' && product.id === 41 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=VEO%20AI%20video%20generation%20artificial%20intelligence%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20video%20creation%20tool&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      
                      {product.category === 'ai' && product.id === 43 && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Grok%20AI%20premium%20artificial%20intelligence%20chatbot%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20assistant&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Microsoft Products */}
                      {product.category === 'microsoft' && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Microsoft%20Office%20365%20logo%20productivity%20suite%20blue%20modern%20design%20clean%20minimalist%20background%20professional%20business%20software%20applications&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Twitter Products */}
                      {product.category === 'twitter' && (
                        <img
                          src={`https://readdy.ai/api/search-image?query=Twitter%20X%20social%20media%20platform%20bird%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20communication%20social%20network&width=200&height=200&seq=${product.id}&orientation=squarish`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Default fallback for categories without specific images */}
                      {!['tiktok', 'facebook', 'instagram', 'youtube', 'telegram', 'shopee', 'premium', 'design', 'software', 'netflix', 'ai', 'microsoft', 'twitter'].includes(product.category) && (
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center bg-gray-100`}
                        >
                          <i className="text-3xl ri-apps-line text-gray-600"></i>
                        </div>
                      )}
                    </div>
                    {product.discount > 0 && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1">
                        -{product.discount}%
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem]">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-purple-600 font-medium text-base">
                        {typeof product.price === 'number' && product.price >= 1000 
                          ? `${product.price.toLocaleString()}đ`
                          : `${product.price}đ`
                        }
                      </span>
                      {product.discount > 0 && (
                        <span className="text-gray-400 line-through text-xs">
                          {typeof product.originalPrice === 'number' && product.originalPrice >= 1000 
                            ? `${product.originalPrice.toLocaleString()}đ`
                            : `${product.originalPrice}đ`
                          }
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center">
                        <i className="ri-time-line mr-1"></i>
                        {product.speed}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${ 
                        product.quality === 'Cao' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {product.quality}
                      </span>
                    </div>

                    <Link 
                      href={`/dashboard/products/${product.id}`}
                      className="block w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-2 rounded-sm text-sm hover:from-purple-600 hover:to-blue-600 transition-colors"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-search-line text-3xl text-gray-400"></i>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500">Thử thay đổi từ khóa hoặc danh mục khác</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="h-4 sm:h-6 lg:hidden"></div>
    </div>
  );
}