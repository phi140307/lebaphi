
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSupportNotification, setShowSupportNotification] = useState(true);

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
      name: 'ChatGPT EDU (ngang Plus - 2 năm)',
      category: 'ai',
      price: 700000,
      originalPrice: 1000000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản ChatGPT EDU tính năng tương đương Plus, thời hạn 2 năm.',
      status: 'active',
      discount: 30
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
      name: 'ChatGPT Plus (Nâng email khách - Chưa từng nâng)',
      category: 'ai',
      price: 125000,
      originalPrice: 180000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp chính chủ từ email khách (áp dụng cho tài khoản chưa từng nâng cấp).',
      status: 'active',
      discount: 30
    },
    {
      id: 25,
      name: 'ChatGPT Plus (Nâng email khách - Đã từng nâng)',
      category: 'ai',
      price: 210000,
      originalPrice: 300000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp chính chủ từ email khách (áp dụng cho tài khoản đã từng nâng cấp).',
      status: 'active',
      discount: 30
    },
    {
      id: 26,
      name: 'ChatGPT Plus (Nâng email khách - Gói tiết kiệm)',
      category: 'ai',
      price: 95000,
      originalPrice: 150000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Nâng cấp chính chủ từ email khách với mức giá tiết kiệm nhất.',
      status: 'active',
      discount: 36
    },
    {
      id: 27,
      name: 'Perplexity Pro (1 tháng)',
      category: 'ai',
      price: 125000,
      originalPrice: 180000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Perplexity Pro thời hạn 1 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 28,
      name: 'Perplexity Pro (12 tháng)',
      category: 'ai',
      price: 420000,
      originalPrice: 600000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Perplexity Pro thời hạn 12 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 29,
      name: 'Grok Super (1 tháng)',
      category: 'ai',
      price: 140000,
      originalPrice: 200000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Grok Super thời hạn 1 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 30,
      name: 'Grok Super (6 tháng)',
      category: 'ai',
      price: 630000,
      originalPrice: 900000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Grok Super thời hạn 6 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 31,
      name: 'Grok Super (12 tháng)',
      category: 'ai',
      price: 970000,
      originalPrice: 1400000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Grok Super thời hạn 12 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 32,
      name: 'Google Gemini Pro (1 tháng)',
      category: 'ai',
      price: 115000,
      originalPrice: 165000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp Google Gemini Pro thời hạn 1 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 33,
      name: 'Google Gemini Pro + 2TB Drive (1 năm)',
      category: 'ai',
      price: 140000,
      originalPrice: 200000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Gói năm kèm theo 2TB dung lượng Google Drive lưu trữ.',
      status: 'active',
      discount: 30
    },
    {
      id: 34,
      name: 'Leonardo AI (1 tháng)',
      category: 'ai',
      price: 350000,
      originalPrice: 500000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Tài khoản Leonardo AI 1 tháng. Mức giá dao động 350k - 420k tùy gói.',
      status: 'active',
      discount: 30
    },
    {
      id: 35,
      name: 'Kling AI - 1100 Credit (1 tháng)',
      category: 'ai',
      price: 230000,
      originalPrice: 330000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Kling AI kèm 1100 Credit sử dụng trong 1 tháng.',
      status: 'active',
      discount: 30
    },

    // ================= NHÓM EDIT / THIẾT KẾ =================
    {
      id: 36,
      name: 'Canva Edu (1 năm)',
      category: 'design',
      price: 70000,
      originalPrice: 100000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-1 giờ',
      quality: 'Cao',
      description: 'Tài khoản Canva Edu thời hạn 1 năm.',
      status: 'active',
      discount: 30
    },
    {
      id: 37,
      name: 'Canva Edu (3 năm)',
      category: 'design',
      price: 105000,
      originalPrice: 150000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-1 giờ',
      quality: 'Cao',
      description: 'Tài khoản Canva Edu siêu tiết kiệm thời hạn 3 năm.',
      status: 'active',
      discount: 30
    },
    {
      id: 38,
      name: 'Canva Pro Chuẩn (1 tháng)',
      category: 'design',
      price: 15000,
      originalPrice: 25000,
      minOrder: 1,
      maxOrder: 20,
      speed: '0-1 giờ',
      quality: 'Cao',
      description: 'Tài khoản Canva Pro chuẩn thời hạn 1 tháng.',
      status: 'active',
      discount: 40
    },
    {
      id: 39,
      name: 'Canva Pro Chuẩn (12 tháng)',
      category: 'design',
      price: 175000,
      originalPrice: 250000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Canva Pro chuẩn thời hạn 12 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 40,
      name: 'CapCut Pro Cấp lẻ (1 tháng)',
      category: 'design',
      price: 50000,
      originalPrice: 75000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Cấp quyền dùng CapCut Pro 1 tháng.',
      status: 'active',
      discount: 33
    },
    {
      id: 41,
      name: 'CapCut Pro Cấp lẻ (3 tháng)',
      category: 'design',
      price: 130000,
      originalPrice: 190000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Cấp quyền dùng CapCut Pro 3 tháng.',
      status: 'active',
      discount: 31
    },
    {
      id: 42,
      name: 'CapCut Pro Cấp lẻ (6 tháng)',
      category: 'design',
      price: 240000,
      originalPrice: 350000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Cấp quyền dùng CapCut Pro 6 tháng.',
      status: 'active',
      discount: 31
    },
    {
      id: 43,
      name: 'CapCut Pro Cấp lẻ (1 năm)',
      category: 'design',
      price: 340000,
      originalPrice: 500000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Cấp quyền dùng CapCut Pro 1 năm.',
      status: 'active',
      discount: 32
    },
    {
      id: 44,
      name: 'CapCut Pro Full Acc (6 tháng)',
      category: 'design',
      price: 420000,
      originalPrice: 600000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Giao toàn quyền (Full acc) CapCut Pro trong 6 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 45,
      name: 'CapCut Pro Full Acc (1 năm)',
      category: 'design',
      price: 560000,
      originalPrice: 800000,
      minOrder: 1,
      maxOrder: 3,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Giao toàn quyền (Full acc) CapCut Pro trong 1 năm.',
      status: 'active',
      discount: 30
    },
    {
      id: 46,
      name: 'Adobe (6 tháng)',
      category: 'design',
      price: 350000,
      originalPrice: 500000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-6 giờ',
      quality: 'Cao',
      description: 'Tài khoản ứng dụng Adobe thời hạn 6 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 47,
      name: 'Meitu VIP (1 tháng)',
      category: 'design',
      price: 125000,
      originalPrice: 180000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp Meitu VIP sử dụng full tính năng trong 1 tháng.',
      status: 'active',
      discount: 30
    },

    // ================= NHÓM GIẢI TRÍ =================
    {
      id: 48,
      name: 'YouTube Premium (1 tháng)',
      category: 'entertainment',
      price: 40000,
      originalPrice: 60000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-1 giờ',
      quality: 'Cao',
      description: 'Nâng cấp YouTube Premium không quảng cáo 1 tháng.',
      status: 'active',
      discount: 33
    },
    {
      id: 49,
      name: 'YouTube Premium (6 tháng)',
      category: 'entertainment',
      price: 210000,
      originalPrice: 300000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp YouTube Premium không quảng cáo 6 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 50,
      name: 'YouTube Premium (12 tháng)',
      category: 'entertainment',
      price: 460000,
      originalPrice: 650000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp YouTube Premium không quảng cáo 12 tháng.',
      status: 'active',
      discount: 29
    },
    {
      id: 51,
      name: 'Netflix (1 tháng)',
      category: 'entertainment',
      price: 50000,
      originalPrice: 75000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản Netflix 1 tháng (Giá dao động 50k - 125k tùy loại: Dùng chung / Riêng / Farm).',
      status: 'active',
      discount: 33
    },
    {
      id: 52,
      name: 'Spotify Premium (6 tháng)',
      category: 'entertainment',
      price: 390000,
      originalPrice: 550000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp Spotify Premium chính chủ thời hạn 6 tháng.',
      status: 'active',
      discount: 29
    },
    {
      id: 53,
      name: 'Spotify Premium (12 tháng)',
      category: 'entertainment',
      price: 540000,
      originalPrice: 770000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp Spotify Premium chính chủ thời hạn 12 tháng.',
      status: 'active',
      discount: 30
    },

    // ================= NHÓM HỌC TẬP & KHÁC =================
    {
      id: 54,
      name: 'Microsoft Office 365 + 1TB (1 năm)',
      category: 'microsoft',
      price: 210000,
      originalPrice: 300000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-4 giờ',
      quality: 'Cao',
      description: 'Bộ công cụ Office 365 kèm 1TB OneDrive thời hạn 1 năm.',
      status: 'active',
      discount: 30
    },
    {
      id: 55,
      name: 'Quizlet Plus (1 tháng)',
      category: 'education',
      price: 40000,
      originalPrice: 60000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản học tập Quizlet Plus thời hạn 1 tháng.',
      status: 'active',
      discount: 33
    },
    {
      id: 56,
      name: 'Quizlet Plus (12 tháng)',
      category: 'education',
      price: 210000,
      originalPrice: 300000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Tài khoản học tập Quizlet Plus thời hạn 12 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 57,
      name: 'Duolingo Super (12 tháng)',
      category: 'education',
      price: 390000,
      originalPrice: 550000,
      minOrder: 1,
      maxOrder: 5,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Nâng cấp học ngoại ngữ Duolingo Super thời hạn 1 năm.',
      status: 'active',
      discount: 29
    },
    {
      id: 58,
      name: 'Grammarly Premium (1 tháng)',
      category: 'education',
      price: 210000,
      originalPrice: 300000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Công cụ sửa lỗi ngữ pháp tiếng Anh Grammarly Premium 1 tháng.',
      status: 'active',
      discount: 30
    },
    {
      id: 59,
      name: 'Locket Gold (Vĩnh viễn)',
      category: 'premium',
      price: 65000,
      originalPrice: 100000,
      minOrder: 1,
      maxOrder: 10,
      speed: '0-2 giờ',
      quality: 'Cao',
      description: 'Locket Gold dùng vĩnh viễn (Bảo hành 1 năm).',
      status: 'active',
      discount: 35
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        const priceA =
          typeof a.price === 'number'
            ? a.price
            : parseInt(String(a.price).replace(/[^0-9]/g, '')) || 0;
        const priceB =
          typeof b.price === 'number'
            ? b.price
            : parseInt(String(b.price).replace(/[^0-9]/g, '')) || 0;
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
  };

  const handleAddToCart = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Support Notification Bar */}
      {showSupportNotification && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3 relative">
          <div className="flex items-center justify-center text-center">
            <div className="flex items-center space-x-2 text-sm md:text-base">
              <i className="ri-customer-service-line text-lg md:text-xl animate-pulse"></i>
              <span className="font-medium">
                Bên mình có hỗ trợ các vấn đề các nền tảng mạng xã hội (Unlock FB 282, 956, FAQ...), mở live TikTok
              </span>
              <span className="hidden sm:inline">-</span>
              <div className="flex items-center space-x-1">
                <i className="ri-message-3-line text-base"></i>
                <span className="font-bold">Liên hệ Zalo: 0369842545</span>
              </div>
              <span className="hidden sm:inline">để mình hỗ trợ nhé!</span>
            </div>
          </div>
          <button
            onClick={() => setShowSupportNotification(false)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
      )}

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

            <div className="relative p-2 text-white">
              <i className="ri-shopping-cart-line text-xl cursor-pointer hover:text-purple-200"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                0
              </span>
            </div>

            <div className="relative">
              <Link href="/login" className="flex items-center space-x-2 text-white hover:text-purple-200">
                <i className="ri-user-line text-xl"></i>
                <span className="hidden sm:block text-sm">Đăng nhập</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-white text-sm">
            <Link href="/" className="hover:text-purple-200 font-medium">
              Trang chủ
            </Link>
            <Link href="/dashboard/products" className="hover:text-purple-200">
              Sản phẩm
            </Link>
            <button
              onClick={() => setShowLoginModal(true)}
              className="hover:text-purple-200 cursor-pointer"
            >
              Đơn hàng
            </button>
          </div>
        </div>
      </div>

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
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="bg-white w-4/5 h-full p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
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
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded text-left ${
                    selectedCategory === category.id
                      ? 'bg-purple-50 text-purple-600 border border-purple-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
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
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left transition-colors ${
                    selectedCategory === category.id
                      ? 'text-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                  }`}
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
              <Link href="/" className="hover:text-purple-600">
                Trang chủ
              </Link>
              <i className="ri-arrow-right-s-line"></i>
              <span>Sản phẩm</span>
              {selectedCategory !== 'all' && (
                <>
                  <i className="ri-arrow-right-s-line"></i>
                  <span className="text-purple-600">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                </>
              )}
            </div>
          </div>

          {selectedCategory !== 'all' && (
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 mb-4 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                  <i
                    className={`${categories.find((c) => c.id === selectedCategory)?.icon} text-2xl`}
                  ></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-purple-100">{sortedProducts.length} sản phẩm có sẵn</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-4" data-products-grid>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
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
                      {![ 'tiktok', 'facebook', 'instagram', 'youtube', 'telegram', 'shopee', 'premium', 'design', 'software', 'netflix', 'ai', 'microsoft', 'twitter' ].includes(product.category) && (
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
                          : `${product.price}đ`}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-gray-400 line-through text-xs">
                          {typeof product.originalPrice === 'number' && product.originalPrice >= 1000
                            ? `${product.originalPrice.toLocaleString()}đ`
                            : `${product.originalPrice}đ`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="flex items-center">
                        <i className="ri-time-line mr-1"></i>
                        {product.speed}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full ${
                          product.quality === 'Cao' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {product.quality}
                      </span>
                    </div>

                    <Link
                      href={`/product/${product.id}`}
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

      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-line text-2xl text-purple-600"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Đăng nhập để tiếp tục</h3>
              <p className="text-gray-600 text-sm">
                Bạn cần đăng nhập để có thể thêm sản phẩm vào giỏ hàng
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/login"
                className="block w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center py-3 px-4 rounded hover:from-purple-600 hover:to-blue-600 transition-colors font-medium"
              >
                Đăng nhập
              </Link>

              <Link
                href="/register"
                className="block w-full border border-purple-500 text-purple-600 text-center py-3 px-4 rounded hover:bg-purple-50 transition-colors font-medium"
              >
                Đăng ký tài khoản
              </Link>

              <button
                onClick={() => setShowLoginModal(false)}
                className="block w-full text-gray-500 text-center py-2 hover:text-gray-700 transition-colors"
              >
                Tiếp tục xem sản phẩm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-4 sm:h-6 lg:hidden"></div>
    </div>
  );
}
