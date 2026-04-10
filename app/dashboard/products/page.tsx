'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserById } from '../../../lib/supabase';
import { getProductImage } from '../../../lib/product-images';

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
setCurrentUser(demoUser as any);
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
setCurrentUser(demoUser as any);

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
            <div className="mb-5 overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-900 to-blue-700 p-5 text-white shadow-xl shadow-purple-200/70">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur">
                  <i className={`${categories.find(c => c.id === selectedCategory)?.icon} text-2xl`}></i>
                </div>
                <div>
                  <h2 className="mb-1 text-xl font-bold">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-sm text-purple-100">
                    {sortedProducts.length} sản phẩm có sẵn
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" data-products-grid>
              {sortedProducts.map((product) => {
                const productImage = getProductImage(product, 200);

                return <div key={product.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/80">
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-white/40"></div>
                    <div className="absolute left-3 top-3 z-10 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur">
                      {categories.find((c) => c.id === product.category)?.name || product.category}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      {productImage.type === 'image' ? (
                        <img
                          src={productImage.src}
                          alt={productImage.alt}
                          className={`h-full w-full ${productImage.fit === 'cover' ? 'object-cover' : 'object-contain p-3 sm:p-4'}`}
                        />
                      ) : (
                        <div className={productImage.containerClassName}>
                          <i className={`text-3xl ${productImage.iconClassName}`}></i>
                        </div>
                      )}
                    </div>
                    {product.discount > 0 && (
                      <div className="absolute right-3 top-3 z-10 rounded-full bg-rose-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg">
                        -{product.discount}%
                      </div>
                    )}
                    <div className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-between rounded-2xl bg-slate-950/70 px-3 py-2 text-[11px] text-white backdrop-blur">
                      <span className="flex items-center gap-1.5 text-slate-100">
                        <i className="ri-time-line"></i>
                        {product.speed}
                      </span>
                      <span className={`rounded-full px-2 py-1 font-medium ${
                        product.quality === 'Cao'
                          ? 'bg-emerald-400/20 text-emerald-200'
                          : 'bg-amber-300/20 text-amber-100'
                      }`}>
                        {product.quality}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    <h3 className="min-h-[2.8rem] text-sm font-semibold leading-5 text-slate-800 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-end justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-violet-600">
                          {typeof product.price === 'number' && product.price >= 1000 
                            ? `${product.price.toLocaleString()}đ`
                            : `${product.price}đ`
                          }
                        </span>
                        {product.discount > 0 && (
                          <span className="text-xs text-slate-400 line-through">
                            {typeof product.originalPrice === 'number' && product.originalPrice >= 1000 
                              ? `${product.originalPrice.toLocaleString()}đ`
                              : `${product.originalPrice}đ`
                            }
                          </span>
                        )}
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        Từ {product.minOrder.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div className="rounded-2xl bg-slate-50 px-3 py-2">
                        <p className="mb-1 text-slate-400">Tối thiểu</p>
                        <p className="font-semibold text-slate-700">{product.minOrder.toLocaleString()}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 px-3 py-2">
                        <p className="mb-1 text-slate-400">Tối đa</p>
                        <p className="font-semibold text-slate-700">{product.maxOrder.toLocaleString()}</p>
                      </div>
                    </div>

                    <Link 
                      href={`/dashboard/products/${product.id}`}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 py-2.5 text-sm font-medium text-white transition-all hover:bg-violet-600"
                    >
                      <span>Xem chi tiết</span>
                      <i className="ri-arrow-right-up-line"></i>
                    </Link>
                  </div>
                </div>;
              })}
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
