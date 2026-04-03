
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cartManager } from '../../../lib/cart';
import { useRouter } from 'next/navigation';

const products = [
  // TikTok Products
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
    description: 'Like TikTok Việt Nam chất lượng cao, tăng nhanh không rớt. Phù hợp cho video mới và cần tăng tương tác nhanh. Từ tài khoản Việt Nam thật 100%.',
    status: 'active',
    discount: 33,
    features: [
      'Like từ tài khoản Việt Nam thật',
      'Tốc độ tăng cực nhanh 0-30 phút',
      'Không rớt sau khi hoàn thành',
      'Hỗ trợ video mới và cũ',
      'Bảo hành 30 ngày'
    ]
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
    description: 'Follow TikTok từ tài khoản thật 100%, không rớt, có avatar và hoạt động. Tăng uy tín profile và độ tin cậy.',
    status: 'active',
    discount: 33,
    features: [
      'Follow từ tài khoản thật 100%',
      'Có avatar và thông tin đầy đủ',
      'Tài khoản hoạt động tích cực',
      'Bảo hành không rớt',
      'Tăng uy tín profile'
    ]
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
    description: 'View TikTok Việt Nam giá rẻ nhất thị trường, tốc độ cực nhanh. Thích hợp cho video cần nhiều lượt xem với ngân sách thấp.',
    status: 'active',
    discount: 50,
    features: [
      'View từ Việt Nam',
      'Giá rẻ nhất thị trường',
      'Tốc độ cực nhanh 0-15 phút',
      'Hỗ trợ video mới',
      'Số lượng lớn'
    ]
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
    description: 'Share TikTok tăng độ lan truyền video, giúp video được nhiều người xem hơn. Chia sẻ từ tài khoản thật có hoạt động.',
    status: 'active',
    discount: 33,
    features: [
      'Share từ tài khoản thật',
      'Tăng độ lan truyền',
      'Giúp video viral',
      'Tốc độ ổn định',
      'Hỗ trợ 24/7'
    ]
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
    description: 'Comment TikTok từ tài khoản Việt Nam thật, nội dung tích cực phù hợp. Tăng tương tác chất lượng và độ tin cậy.',
    status: 'active',
    discount: 33,
    features: [
      'Comment từ tài khoản Việt Nam thật',
      'Nội dung tích cực, phù hợp',
      'Tăng tương tác chất lượng',
      'Có thể custom nội dung',
      'Bảo hành 30 ngày'
    ]
  },

  // Facebook Products
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
    description: 'Tăng like bài viết Facebook chất lượng cao, tốc độ nhanh. Tăng tương tác cho bài viết Facebook của bạn với like từ tài khoản Việt Nam thật.',
    status: 'active',
    discount: 33,
    features: [
      'Like từ tài khoản Việt Nam thật',
      'Tốc độ tăng nhanh 0-1 giờ',
      'Không rớt sau khi hoàn thành',
      'Hỗ trợ 24/7',
      'Tăng engagement tự nhiên'
    ]
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
    description: 'Follow Facebook Page từ tài khoản thật, tăng lượng theo dõi fanpage nhanh chóng và ổn định.',
    status: 'active',
    discount: 33,
    features: [
      'Follow từ tài khoản thật',
      'Tăng follower fanpage',
      'Tốc độ ổn định',
      'Bảo hành không rớt',
      'Nâng cao uy tín page'
    ]
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
    description: 'Tăng chia sẻ bài viết Facebook nhanh chóng, hiệu quả. Tăng độ lan truyền bài viết và reach tự nhiên.',
    status: 'active',
    discount: 33,
    features: [
      'Share nhanh chóng',
      'Tăng độ lan truyền',
      'Giá cả phải chăng',
      'Hỗ trợ bài viết mới',
      'Tăng reach tự nhiên'
    ]
  },

  // Instagram Products  
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
    description: 'Follow Instagram thật 100%, không rớt. Tăng follower Instagram chất lượng cao từ tài khoản người dùng thật.',
    status: 'active',
    discount: 33,
    features: [
      'Follow từ tài khoản thật 100%',
      'Tốc độ tăng ổn định',
      'Bảo hành không rớt',
      'Tăng uy tín tài khoản',
      'Hỗ trợ profile business'
    ]
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
    description: 'Like Instagram nhanh chóng, tăng tương tác cho bài đăng Instagram và story.',
    status: 'active',
    discount: 33,
    features: [
      'Like nhanh chóng',
      'Tăng engagement',
      'Hỗ trợ post và story',
      'Từ tài khoản thật',
      'Giá cả hợp lý'
    ]
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
    description: 'View Instagram Story tăng lượt xem story, giúp tăng reach tự nhiên và độ phủ sóng.',
    status: 'active',
    discount: 33,
    features: [
      'View story nhanh chóng',
      'Tăng reach tự nhiên',
      'Giá rẻ nhất thị trường',
      'Hỗ trợ story mới',
      'Tốc độ cực nhanh'
    ]
  },

  // YouTube Products
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
    description: 'Subscribe YouTube chất lượng cao, bảo hành không rớt. Tăng subscriber nhanh chóng và ổn định.',
    status: 'active',
    discount: 33,
    features: [
      'Subscribe chất lượng cao',
      'Bảo hành không rớt',
      'Từ tài khoản thật',
      'Tăng uy tín kênh',
      'Hỗ trợ monetization'
    ]
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
    description: 'Like YouTube tăng tương tác video, giúp video được đề xuất nhiều hơn trong thuật toán.',
    status: 'active',
    discount: 33,
    features: [
      'Like tăng tương tác',
      'Giúp video viral',
      'Cải thiện ranking',
      'Tốc độ nhanh',
      'Hỗ trợ 24/7'
    ]
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
    description: 'View YouTube tăng lượt xem video nhanh chóng, giá cả phải chăng, phù hợp mọi ngân sách.',
    status: 'active',
    discount: 33,
    features: [
      'View nhanh chóng',
      'Giá rẻ nhất thị trường',
      'Số lượng lớn',
      'Hỗ trợ video mới',
      'Tăng thời gian xem'
    ]
  },

  // Telegram Products
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
    description: 'Member Telegram thật, hoạt động tích cực. Tăng thành viên group/channel một cách tự nhiên.',
    status: 'active',
    discount: 33,
    features: [
      'Member từ tài khoản thật',
      'Hoạt động tích cực',
      'Tăng thành viên group',
      'Bảo hành không rớt',
      'Nâng cao uy tín'
    ]
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
    description: 'View bài đăng Telegram tăng lượt xem nội dung trong channel, giúp nội dung được nhiều người thấy hơn.',
    status: 'active',
    discount: 33,
    features: [
      'View bài đăng nhanh',
      'Tăng reach nội dung',
      'Từ member thật',
      'Giá cả hợp lý',
      'Hỗ trợ channel lớn'
    ]
  },

  // Twitter Products
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
    description: 'Follow Twitter từ tài khoản thật, tăng follower Twitter chất lượng và uy tín.',
    status: 'active',
    discount: 33,
    features: [
      'Follow từ tài khoản thật',
      'Tăng follower chất lượng',
      'Bảo hành không rớt',
      'Nâng cao uy tín',
      'Hỗ trợ verified account'
    ]
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
    description: 'Like Twitter tăng tương tác tweet, giúp tweet được nhiều người thấy hơn và viral.',
    status: 'active',
    discount: 25,
    features: [
      'Like tăng tương tác',
      'Giúp tweet viral',
      'Từ tài khoản thật',
      'Tốc độ nhanh',
      'Cải thiện engagement'
    ]
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
    description: 'Retweet Twitter tăng độ lan truyền tweet, chia sẻ từ tài khoản thật có follower.',
    status: 'active',
    discount: 33,
    features: [
      'Retweet từ tài khoản thật',
      'Tăng độ lan truyền',
      'Có follower thật',
      'Giúp tweet viral',
      'Nâng cao reach'
    ]
  },

  // Shopee Products
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
    description: 'Follow shop Shopee tăng lượt theo dõi cửa hàng, nâng cao uy tín bán hàng và ranking.',
    status: 'active',
    discount: 33,
    features: [
      'Follow shop chất lượng',
      'Tăng uy tín bán hàng',
      'Cải thiện ranking',
      'Từ tài khoản buyer thật',
      'Hỗ trợ shop mới'
    ]
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
    description: 'Like sản phẩm Shopee tăng tương tác, giúp sản phẩm được ưu tiên hiển thị và tăng conversion.',
    status: 'active',
    discount: 33,
    features: [
      'Like sản phẩm chất lượng',
      'Tăng ranking sản phẩm',
      'Ưu tiên hiển thị',
      'Từ buyer thật',
      'Tăng conversion rate'
    ]
  },

  // Premium Account Products 
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
    discount: 20,
    features: [
      'Tài khoản ChatGPT Plus chính hãng',
      'Nâng cấp từ email của bạn',
      'Bảo hành full 3 tháng',
      'Hỗ trợ GPT-4 và plugins',
      'Ưu tiên truy cập khi peak hours'
    ]
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
    discount: 30,
    features: [
      'Canva Pro 1 năm chính hãng',
      'Nâng cấp từ email của bạn',
      'Bảo hành full năm',
      'Tất cả tính năng Pro',
      'Hỗ trợ 24/7'
    ]
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
    discount: 33,
    features: [
      'Canva Pro vĩnh viễn chính hãng',
      'Nâng cấp từ email của bạn',
      'Bảo hành full vĩnh viễn',
      'Tất cả tính năng Pro',
      'Hỗ trợ VIP'
    ]
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
    discount: 25,
    features: [
      'Nghe nhạc không cần quảng cáo',
      'Tải nhạc offline',
      'Chất lượng âm thanh cao',
      'Bỏ qua không giới hạn',
      'Nâng cấp từ email riêng'
    ]
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
    discount: 21,
    features: [
      'Nghe nhạc không quảng cáo',
      'Tải nhạc offline',
      'Chất lượng âm thanh cao',
      'Bỏ qua không giới hạn',
      'Nâng cấp từ email riêng'
    ]
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
    discount: 26,
    features: [
      'Nghe nhạc không quảng cáo',
      'Tải nhạc offline',
      'Chất lượng âm thanh cao',
      'Bỏ qua không giới hạn',
      'Nâng cấp từ email riêng'
    ]
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
    discount: 26,
    features: [
      'CapCut Pro 1 tháng chính hãng',
      '3 thiết bị cùng lúc',
      'Bảo hành full tháng',
      'Tất cả tính năng Pro',
      'Hỗ trợ 24/7'
    ]
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
    discount: 26,
    features: [
      'CapCut Pro 6 tháng chính hãng',
      '3 thiết bị cùng lúc',
      'Bảo hành full 6 tháng',
      'Tất cả tính năng Pro',
      'Hỗ trợ 24/7'
    ]
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
    discount: 30,
    features: [
      'CapCut Pro 1 năm chính hãng',
      '1 máy sử dụng riêng',
      'Bảo hành full năm',
      'Tất cả tính năng Pro',
      'Hỗ trợ VIP'
    ]
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
    discount: 35,
    features: [
      'ChatGPT Plus 1 tháng',
      'Chung với nhiều người',
      'Hỗ trợ GPT-4',
      'Tốc độ nhanh',
      'Giá rẻ nhất'
    ]
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
    discount: 37,
    features: [
      'ChatGPT Plus 2 tháng',
      'Chung với ít người',
      'Hỗ trợ GPT-4',
      '2 thiết bị',
      'Ổn định hơn'
    ]
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
    discount: 33,
    features: [
      'Kling AI Standard 39000 tín',
      'Dùng riêng 1 máy',
      'Tạo video AI chất lượng cao',
      'Bảo hành full thời gian',
      'Hỗ trợ 24/7'
    ]
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
    discount: 33,
    features: [
      'Kling AI Standard 10000 tín',
      'Dùng riêng',
      'Tạo video AI',
      'Bảo hành full thời gian',
      'Giá tốt nhất'
    ]
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
    discount: 33,
    features: [
      'Leonardo Artisan Ultimate',
      '1 tháng sử dụng',
      'Chung với ít người',
      'Tạo hình ảnh AI',
      'Chất lượng cao'
    ]
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
    discount: 33,
    features: [
      'Leonardo gói Meatro',
      '1 tháng sử dụng',
      'Chung với ít người',
      'Tính năng cao cấp',
      'Hỗ trợ chuyên nghiệp'
    ]
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
    discount: 33,
    features: [
      'YouTube Premium Family',
      'Nâng cấp từ email riêng',
      'Không quảng cáo',
      'Tải video offline',
      'YouTube Music Premium'
    ]
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
    discount: 33,
    features: [
      'Netflix Standard',
      '1 thiết bị',
      'Chung với nhiều người',
      'Đổi khi bị out',
      'Giá rẻ'
    ]
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
    discount: 33,
    features: [
      'Netflix Premium',
      '1 thiết bị',
      'Chung với ít người',
      'Đổi khi bị out',
      'Chất lượng tốt hơn'
    ]
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
    discount: 33,
    features: [
      'Netflix 4K Ultra HD',
      'Chính chủ riêng tư',
      '1 tháng đầy đủ',
      '1 thiết bị',
      'Chất lượng 4K'
    ]
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
    discount: 33,
    features: [
      'VEO3 1K Credit',
      'Chính chủ riêng tư',
      '1 tháng',
      '1 thiết bị',
      'Tạo video AI'
    ]
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
    discount: 32,
    features: [
      'Locket Gold premium',
      'Cam kết không định lịch',
      '1 tháng sử dụng',
      '1 thiết bị riêng tư',
      'Hỗ trợ 24/7'
    ]
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
    discount: 33,
    features: [
      'Grok Premium',
      'Nâng cấp từ email riêng',
      '1 tháng',
      'AI chatbot cao cấp',
      'Riêng tư hoàn toàn'
    ]
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
    discount: 33,
    features: [
      'Microsoft Office 365',
      '1TB OneDrive',
      'Full bộ ứng dụng Office',
      'Nâng cấp từ email riêng',
      '1 năm sử dụng'
    ]
  }
];

interface ProductDetailProps {
  productId: string;
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const productIdNum = parseInt(productId);
  const product = products.find((p) => p.id === productIdNum);
  const router = useRouter();

  const [quantity, setQuantity] = useState(product?.minOrder || 100);
  const [targetUrl, setTargetUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
          <Link href="/" className="text-orange-600 hover:text-orange-700">
            Trở về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = quantity * product.price;

  const handleAddToCart = () => {
    if (!targetUrl.trim()) {
      alert('Vui lòng nhập đường link/URL');
      return;
    }

    if (quantity < product.minOrder || quantity > product.maxOrder) {
      alert(`Số lượng phải từ ${product.minOrder} đến ${product.maxOrder}`);
      return;
    }

    const userSession = typeof window !== 'undefined' ? localStorage.getItem('user_session') : null;
    if (!userSession) {
      setShowLoginModal(true);
      return;
    }

    setIsAdding(true);

    try {
      cartManager.addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        category: product.category,
        targetUrl: targetUrl.trim(),
        notes: notes.trim(),
      });
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại.');
      setIsAdding(false);
      return;
    }

    setTimeout(() => {
      setIsAdding(false);
      alert('Đã thêm vào giỏ hàng thành công!');
      router.push('/dashboard/cart');
    }, 500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (typeof window !== 'undefined' && localStorage.getItem('user_session')) {
      setTimeout(() => {
        router.push('/dashboard/checkout');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-white hover:text-purple-200">
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <img
              src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/557260a0b6689a10feeaff4143aebb61.png"
              alt="lebaphi.com"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div className="flex-1 text-center">
              <span className="text-white text-sm">Chi tiết sản phẩm</span>
            </div>
            <Link href="/dashboard/cart" className="relative text-white hover:text-purple-200">
              <i className="ri-shopping-cart-line text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white px-4 py-2 border-b">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-purple-600">
            Trang chủ
          </Link>
          <i className="ri-arrow-right-s-line"></i>
          <span className="text-purple-600 line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Images */}
            <div className="bg-white rounded shadow-sm">
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative">
                {product.category === 'design' && (product.id === 23 || product.id === 24) ? (
                  <img
                    src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/d85a64c4610bb2bdbb8d01a2e3cc28ab.png"
                    alt="Canva Logo"
                    className="w-full h-full object-contain p-4"
                  />
                ) : product.category === 'software' && (product.id === 28 || product.id === 29 || product.id === 30) ? (
                  <img
                    src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/0a9282b6d6e94800abba3307d6371f07.png"
                    alt="CapCut Logo"
                    className="w-full h-full object-contain p-4"
                  />
                ) : product.category === 'ai' && (product.id === 31 || product.id === 32) ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=ChatGPT%20artificial%20intelligence%20premium%20AI%20chatbot%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20assistant%20OpenAI&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="ChatGPT AI"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'ai' && (product.id === 33 || product.id === 34) ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Kling%20AI%20video%20generation%20artificial%20intelligence%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20creation%20tool&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="Kling AI"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'ai' && (product.id === 35 || product.id === 36) ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Leonardo%20AI%20art%20generation%20artificial%20intelligence%20creative%20tool%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20art%20creation&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="Leonardo AI"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'ai' && product.id === 41 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=VEO%20AI%20video%20generation%20artificial%20intelligence%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20video%20creation%20tool&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="VEO AI"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'ai' && product.id === 43 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Grok%20AI%20premium%20artificial%20intelligence%20chatbot%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20assistant&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="Grok AI"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'premium' && product.id === 22 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=ChatGPT%20Plus%20artificial%20intelligence%20premium%20AI%20chatbot%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20technology%20digital%20assistant%20OpenAI&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="ChatGPT Plus"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'premium' && (product.id === 25 || product.id === 26 || product.id === 27) ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Spotify%20music%20streaming%20platform%20green%20logo%20premium%20service%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20entertainment%20audio&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="Spotify Premium"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'premium' && product.id === 42 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Locket%20Gold%20premium%20app%20widget%20photo%20sharing%20modern%20design%20clean%20minimalist%20background%20professional%20mobile%20application%20golden%20premium%20service&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="Locket Gold"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'youtube' && product.id === 37 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=YouTube%20Premium%20logo%20red%20play%20button%20premium%20service%20ad-free%20video%20streaming%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20entertainment&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="YouTube Premium"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'netflix' && (product.id === 38 || product.id === 39 || product.id === 40) ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Netflix%20streaming%20service%20red%20logo%20movie%20entertainment%20platform%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20video%20streaming&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="Netflix"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'microsoft' && product.id === 44 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Microsoft%20Office%20365%20logo%20productivity%20suite%20blue%20modern%20design%20clean%20minimalist%20background%20professional%20business%20software%20applications&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt="Microsoft Office"
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'tiktok' ? (
                  <img
                    src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/74dc4a4dce6861ebcc79aa07c1ab0b14.png"
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : product.category === 'facebook' && product.id === 6 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Facebook%20like%20button%20thumbs%20up%20social%20media%20engagement%20blue%20icon%20modern%20design%20digital%20interaction%20social%20network%20clean%20minimalist%20background%20professional%20sleek%20interface%20user%20engagement&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'facebook' && product.id === 7 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Facebook%20page%20follow%20button%20social%20media%20fanpage%20business%20page%20digital%20marketing%20blue%20interface%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20engagement&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'facebook' && product.id === 8 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Facebook%20share%20button%20social%20media%20viral%20content%20sharing%20blue%20interface%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20digital%20engagement&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'instagram' && product.id === 9 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Instagram%20follow%20button%20pink%20gradient%20social%20media%20followers%20engagement%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20interface%20user%20growth&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'instagram' && product.id === 10 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Instagram%20like%20heart%20button%20pink%20gradient%20social%20media%20engagement%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20interface%20user%20interaction&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'instagram' && product.id === 11 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Instagram%20story%20views%20eye%20icon%20pink%20gradient%20social%20media%20engagement%20modern%20design%20clean%20minimalist%20background%20professional%20social%20network%20interface%20user%20interaction&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'youtube' && product.id === 12 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=YouTube%20subscribe%20button%20red%20play%20button%20video%20platform%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20content%20creator%20channel%20growth&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'youtube' && product.id === 13 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=YouTube%20like%20thumbs%20up%20button%20red%20video%20platform%20engagement%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20content%20interaction&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'youtube' && product.id === 14 ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=YouTube%20video%20views%20play%20button%20red%20counter%20statistics%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20content%20analytics&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'telegram' ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Telegram%20messaging%20app%20blue%20airplane%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20communication%20social%20media%20platform&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'shopee' ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Shopee%20online%20shopping%20platform%20orange%20logo%20e-commerce%20marketplace%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20retail%20store&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : product.category === 'twitter' ? (
                  <img
                    src={`https://readdy.ai/api/search-image?query=Twitter%20X%20social%20media%20platform%20bird%20logo%20modern%20design%20clean%20minimalist%20background%20professional%20digital%20communication%20social%20network&width=400&height=400&seq=${product.id}&orientation=squarish`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/1d687c24a1bdcffbd40d0977605df9ec.png"
                      alt="Lê Bá Phi Logo"
                      className="w-full h-full rounded-lg object-cover absolute opacity-15"
                    />
                    <i
                      className={`text-8xl ${
                        product.category === 'facebook'
                          ? 'ri-facebook-fill text-blue-600'
                          : product.category === 'instagram'
                          ? 'ri-instagram-line text-pink-600'
                          : product.category === 'tiktok'
                          ? 'ri-tiktok-line text-gray-700'
                          : product.category === 'youtube'
                          ? 'ri-youtube-line text-red-600'
                          : product.category === 'telegram'
                          ? 'ri-telegram-line text-blue-500'
                          : product.category === 'shopee'
                          ? 'ri-shopping-bag-line text-orange-600'
                          : product.category === 'twitter'
                          ? 'ri-twitter-line text-blue-400'
                          : 'ri-apps-line text-gray-600'
                      } relative z-10`}
                    ></i>
                  </div>
                )}
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded">
                    Giảm {product.discount}%
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded shadow-sm p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-medium text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="capitalize">{product.category}</span>
                  <span className="flex items-center">
                    <i className="ri-star-fill text-yellow-400 mr-1"></i>
                    4.8 (1.2k đánh giá)
                  </span>
                  <span>Đã bán 5.4k</span>
                </div>
              </div>

              {/* Price */}
              <div className="bg-gray-50 p-4 rounded mb-6">
                <div className="flex items-center space-x-4">
                  {product.discount > 0 && (
                    <span className="text-gray-400 line-through text-lg">
                      {typeof product.originalPrice === 'number' && product.originalPrice >= 1000
                        ? `₫${product.originalPrice.toLocaleString()}`
                        : `₫${product.originalPrice}`}
                    </span>
                  )}
                  <span className="text-purple-600 text-3xl font-medium">
                    {typeof product.price === 'number' && product.price >= 1000
                      ? `₫${product.price.toLocaleString()}`
                      : `₫${product.price}`}
                  </span>
                  {product.discount > 0 && (
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded text-sm">
                      -{product.discount}% GIẢM
                    </span>
                  )}
                </div>
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Số lượng tối thiểu:</span>
                  <span className="text-gray-900">{product.minOrder.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Số lượng tối đa:</span>
                  <span className="text-gray-900">{product.maxOrder.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tốc độ xử lý:</span>
                  <span className="text-gray-900">{product.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Chất lượng:</span>
                  <span
                    className={`${
                      product.quality === 'Cao' ? 'text-green-600' : 'text-yellow-600'
                    }`}
                  >
                    {product.quality}
                  </span>
                </div>
              </div>

              {/* Order Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đường link/URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="Nhập link cần tăng tương tác..."
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng
                  </label>
                  <div className="flex items-center border border-gray-300 rounded overflow-hidden w-32">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || product.minOrder)}
                      min={product.minOrder}
                      max={product.maxOrder}
                      className="flex-1 px-3 py-2 text-center border-0 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.maxOrder, quantity + 1))}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600"
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Từ {product.minOrder.toLocaleString()} đến {product.maxOrder.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    maxLength={200}
                    placeholder="Ghi chú thêm cho đơn hàng..."
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                {/* Total Price */}
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="text-purple-600 font-semibold text-2xl">
                      {totalPrice.toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || !targetUrl.trim()}
                    className="flex-1 bg-purple-100 border border-purple-500 text-purple-600 py-3 px-4 rounded hover:bg-purple-200 transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAdding ? (
                      <div className="flex items-center justify-center">
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Đang thêm...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <i className="ri-shopping-cart-line mr-2"></i>
                        Thêm Vào Giỏ Hàng
                      </div>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={isAdding || !targetUrl.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded hover:from-purple-600 hover:to-blue-600 transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mua Ngay
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="bg-white rounded shadow-sm p-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">MÔ TẢ SẢN PHẨM</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-600 leading-relaxed mb-4">{product.description}</p>

              <h4 className="font-medium text-gray-900 mb-3">Tính năng nổi bật:</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <i className="ri-check-line text-green-600 mt-0.5 flex-shrink-0"></i>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <img
                  src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/1d687c24a1bdcffbd40d0977605df9ec.png"
                  alt="Lê Bá Phi Logo"
                  className="w-8 h-8 rounded-lg object-cover"
                />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Đăng nhập để tiếp tục
              </h3>
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
    </div>
  );
}
