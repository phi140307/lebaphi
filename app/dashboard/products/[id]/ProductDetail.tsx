"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cartManager } from '../../../../lib/cart';
import { useParams } from 'next/navigation';
import { getProductImage } from '../../../../lib/product-images';
import { getProductFeatures, getPublicProductById } from '../../../../lib/public-products';

const legacyProducts = [
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
    ],
    servers: [
      {
        id: 'MC-1',
        name: 'Tăng Like TikTok ~ Lên Ngay ~ Tốc Độ: 1000-2000/Ngày ~ Tài Nguyên Việt Nam ',
        price: 22,
        minOrder: 100,
        maxOrder: 500000,
        speed: '1000-2000/ngày',
        status: 'active'
      },
      {
        id: 'MC-2',
        name: 'Tăng Like TikTok ~ Tốc Độ Siêu Nhanh: 3000-5000/Ngày ~ Tài Nguyên Việt Nam ',
        price: 28,
        minOrder: 100,
        maxOrder: 500000,
        speed: '3000-5000/ngày',
        status: 'active'
      },
      {
        id: 'MC-3',
        name: 'Tăng Like TikTok ~ Tốc Độ Vừa: 500-1000/Ngày ~ Tài Nguyên Việt Nam ',
        price: 20,
        minOrder: 100,
        maxOrder: 500000,
        speed: '500-1000/ngày',
        status: 'active'
      }
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
    description: 'Follow TikTok từ tài k hoản thật 100%, không rớt, có avatar và hoạt động. Tăng uy tín profile.',
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
    description: 'View TikTok Việt Nam giá rẻ nhất thị trường, tốc độ cực nhanh.',
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
    description: 'Share TikTok tăng độ lan truyền video, giúp video được nhiều người xem hơn.',
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
    description: 'Comment TikTok từ tài khoản Việt Nam thật, nội dung tích cực phù hợp.',
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
    description: 'Tăng like bài viết Facebook chất lượng cao, tốc độ nhanh.',
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
    description: 'Follow Facebook Page từ tài khoản thật, tăng lượng theo dõi fanpage nhanh chóng.',
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
    description: 'Tăng chia sẻ bài viết Facebook nhanh chóng, hiệu quả.',
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
    description: 'Follow Instagram thật 100%, không rớt.',
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
    description: 'Like Instagram nhanh chóng, tăng tương tác cho bài đăng Instagram.',
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
    description: 'View Instagram Story tăng lượt xem story, giúp tăng reach tự nhiên.',
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
    description: 'Subscribe YouTube chất lượng cao, bảo hành không rớt.',
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
    description: 'Like YouTube tăng tương tác video, giúp video được đề xuất nhiều hơn.',
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
    description: 'View YouTube tăng lượt xem video nhanh chóng, giá cả phải chăng.',
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
    description: 'Member Telegram thật, hoạt động tích cực.',
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
    description: 'View bài đăng Telegram tăng lượt xem nội dung trong channel.',
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
    description: 'Follow Twitter từ tài khoản thật, tăng follower Twitter chất lượng.',
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
    description: 'Like Twitter tăng tương tác tweet, giúp tweet được nhiều người thấy hơn.',
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
    description: 'Retweet Twitter tăng độ lan truyền tweet, chia sẻ từ tài khoản thật.',
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
    description: 'Follow shop Shopee tăng lượt theo dõi cửa hàng, nâng cao uy tín bán hàng.',
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
    description: 'Like sản phẩm Shopee tăng tương tác, giúp sản phẩm được ưu tiên hiển thị.',
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
    description: 'Tài khoản ChatGPT Plus 3 tháng, nâng cấp từ email bạn.',
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
    description: 'Tài khoản Canva Pro 1 năm, nâng cấp từ email của bạn.',
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
    description: 'Tài khoản Canva Pro vĩnh viễn, nâng cấp từ email của bạn.',
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
    description: 'Tài khoản Spotify Premium 1 tháng, nâng cấp từ email của bạn.',
    status: 'active',
    discount: 25,
    features: [
      'Nghe nhạc không quảng cáo',
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
    description: 'Tài khoản Spotify Premium 3 tháng, nâng cấp từ email của bạn.',
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
    description: 'Tài khoản Spotify Premium 1 năm, nâng cấp từ email của bạn.',
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
    description: 'Tài khoản CapCut Pro 1 tháng, 3 thiết bị sử dụng.',
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
    description: 'Tài khoản CapCut Pro 6 tháng, 3 thiết bị sử dụng.',
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
    description: 'Tài khoản CapCut Pro 1 năm, 1 máy sử dụng.',
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
    description: 'Tài khoản ChatGPT Plus 1 tháng, 1 máy sử dụng.',
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
    description: 'Tài khoản ChatGPT Plus 2 tháng, 2 máy sử dụng.',
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
    description: 'Tài khoản Kling AI gói Standard 10000 tín dùng dựng riêng từ.',
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
    description: 'Tài khoản Leonardo Artisan Ultimate 1 tháng, 1 máy sử dụng.',
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
    description: 'Tài khoản Leonardo gói Meatro 1 tháng, 1 máy sử dụng.',
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
    description: 'Tài khoản YouTube Premium Family 1 tháng, nâng cấp từ email của bạn.',
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
    description: 'Tài khoản Netflix hàng Farm loại standard, 1 thiết bị.',
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
    description: 'Tài khoản Netflix hàng Farm loại premium, 1 thiết bị.',
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
    description: 'Tài khoản Netflix chính chủ dùng riêng từ ultra HD 4K, 1 tháng.',
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
    description: 'Tài khoản VEO3 1K Credit dùng chính chủ, 1 tháng, 1 thiết bị.',
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
    description: 'Tài khoản Locket Gold cam kết không định lịch, 1 tháng, 1 thiết bị.',
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
    description: 'Tài khoản Grok Premium 1 tháng, nâng cấp từ email của bạn.',
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
  const params = useParams<{ id: string }>();
  const resolvedProductId = productId || params?.id || '';
  const productIdNum = parseInt(resolvedProductId, 10);
  const product = getPublicProductById(productIdNum);

  const [selectedServer, setSelectedServer] = useState('');
  const [quantity, setQuantity] = useState(product?.minOrder || 100);
  const [targetUrl, setTargetUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('new-order');
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    if (product && product.servers && product.servers.length > 0) {
      setSelectedServer(product.servers[0].id);
    }
    if (product) {
      setQuantity(product.minOrder);
    }

    // Load cart items count
    const updateCartCount = () => {
      setCartItems(cartManager.getTotalItems());
    };

    updateCartCount();
    const unsubscribe = cartManager.subscribe(updateCartCount);

    return () => unsubscribe();
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-3xl text-gray-400"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-500 mb-6">Sản phẩm ID #{resolvedProductId || productId} không tồn tại trong hệ thống</p>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Trở về danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  const currentServer = product.servers?.find((s) => s.id === selectedServer);
  const currentPrice = currentServer ? currentServer.price : product.price;
  const totalPrice = quantity * currentPrice;
  const productImage = getProductImage(product, 240);
  const productFeatures = getProductFeatures(product);

  const handleAddToCart = () => {
    if (!targetUrl.trim()) {
      alert('Vui lòng nhập đường link/URL');
      return;
    }

    if (product.servers && product.servers.length > 0 && !selectedServer) {
      alert('Vui lòng chọn máy chủ');
      return;
    }

    const minOrder = currentServer ? currentServer.minOrder : product.minOrder;
    const maxOrder = currentServer ? currentServer.maxOrder : product.maxOrder;

    if (quantity < minOrder || quantity > maxOrder) {
      alert(`Số lượng phải từ ${minOrder.toLocaleString()} đến ${maxOrder.toLocaleString()}`);
      return;
    }

    setIsAdding(true);

    try {
      cartManager.addItem({
        productId: product.id,
        name: product.name + (currentServer ? ` (${currentServer.id})` : ''),
        price: currentPrice,
        quantity,
        category: product.category,
        targetUrl: targetUrl.trim(),
        notes: notes.trim()
      });

      // Hiển thị thông báo thành công
      alert('Đã thêm vào giỏ hàng thành công!');
      
      // Reset form
      setTargetUrl('');
      setNotes('');
      setQuantity(product.minOrder);
      
      setIsAdding(false);
      
      // Không tự động chuyển hướng, để người dùng tự quyết định
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsAdding(false);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng. Vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard/products" className="text-gray-500 hover:text-gray-700">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <img
                src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/557260a0b6689a10feeaff4143aebb61.png"
                alt="logo"
                className="w-8 h-8 rounded object-cover"
              />
            </div>
            <Link href="/dashboard/cart" className="relative text-gray-600 hover:text-blue-600">
              <i className="ri-shopping-cart-line text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center min-w-[20px]">
                {cartItems}
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            <div className="p-4">
              <div className="mb-6">
                <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-blue-600 mb-4">
                  <i className="ri-home-line mr-2"></i>
                  Trang chủ
                </Link>
                <Link href="/dashboard/deposit" className="flex items-center text-gray-600 hover:text-blue-600 mb-4">
                  <i className="ri-money-dollar-circle-line mr-2"></i>
                  Nạp tiền
                </Link>
              </div>

              <div className="mb-4">
                <h6 className="text-xs font-semibold text-gray-500 uppercase mb-3">DỊCH VỤ VIỆT NAM</h6>
                <div className="space-y-1">
                  <Link href="/dashboard/products?category=tiktok" className={`flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded text-sm ${product.category === 'tiktok' ? 'bg-blue-50' : ''}`}>
                    <i className="ri-tiktok-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                    TikTok
                  </Link>
                  <Link href="/dashboard/products?category=facebook" className={`flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded text-sm ${product.category === 'facebook' ? 'bg-blue-50' : ''}`}>
                    <i className="ri-facebook-fill mr-2 w-4 h-4 flex items-center justify-center"></i>
                    Facebook
                  </Link>
                  <Link href="/dashboard/products?category=instagram" className={`flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded text-sm ${product.category === 'instagram' ? 'bg-blue-50' : ''}`}>
                    <i className="ri-instagram-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                    Instagram
                  </Link>
                  <Link href="/dashboard/products?category=youtube" className={`flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded text-sm ${product.category === 'youtube' ? 'bg-blue-50' : ''}`}>
                    <i className="ri-youtube-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                    YouTube
                  </Link>
                </div>
              </div>

              <div>
                <h6 className="text-xs font-semibold text-gray-500 uppercase mb-3">TÀI KHOẢN PREMIUM</h6>
                <div className="space-y-1">
                  <Link href="/dashboard/products?category=premium" className={`flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded text-sm ${product.category === 'premium' ? 'bg-blue-50' : ''}`}>
                    <i className="ri-tv-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                    YouTube Premium
                  </Link>
                  <Link href="/dashboard/products?category=design" className={`flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded text-sm ${product.category === 'design' ? 'bg-blue-50' : ''}`}>
                    <i className="ri-palette-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                    Canva Pro
                  </Link>
                  <Link href="/dashboard/products?category=ai" className={`flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded text-sm ${product.category === 'ai' ? 'bg-blue-50' : ''}`}>
                    <i className="ri-robot-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                    ChatGPT Plus
                  </Link>
                  <Link href="/dashboard/products?category=software" className={`flex items-center text-gray-700 hover:text-blue-600 py-2 px-3 rounded text-sm ${product.category === 'software' ? 'bg-blue-50' : ''}`}>
                    <i className="ri-computer-line mr-2 w-4 h-4 flex items-center justify-center"></i>
                    Phần mềm
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Page Header */}
              <div className="p-6 border-b">
                <h1 className="text-xl font-bold text-gray-900 flex items-center">
                  <i className={`ri-${product.category === 'tiktok' ? 'tiktok' : product.category === 'facebook' ? 'facebook-fill' : product.category === 'instagram' ? 'instagram' : product.category === 'youtube' ? 'youtube' : 'apps'}-line mr-2 w-6 h-6 flex items-center justify-center`}></i>
                  {product.category.toUpperCase()} 
                  <i className="ri-arrow-right-double-line mx-2 text-gray-400"></i>
                  {product.name}
                </h1>

                {/* Tab Navigation */}
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => setActiveTab('new-order')}
                    className={`px-4 py-2 rounded font-medium text-sm whitespace-nowrap ${activeTab === 'new-order' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    KHỞI TẠO ĐƠN HÀNG
                  </button>
                  <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 rounded font-medium text-sm whitespace-nowrap ${activeTab === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    <i className="ri-history-line mr-2"></i>
                    LỊCH SỬ ĐƠN HÀNG
                  </button>
                </div>
              </div>

              {activeTab === 'new-order' && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Form */}
                    <div className="lg:col-span-2">
                      <div className="space-y-6">
                        {/* URL Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhập Link Trang Cá Nhân:
                          </label>
                          <input
                            type="url"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="Nhập Link Trang Cá Nhân cần mua"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                          />
                        </div>

                        {/* Server Selection */}
                        {product.servers && product.servers.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Chọn máy chủ:
                            </label>
                            <div className="space-y-3">
                              {product.servers.map((server) => (
                                <div key={server.id} className="border border-gray-200 rounded-lg p-4">
                                  <div className="flex items-start">
                                    <input
                                      type="radio"
                                      id={`server-${server.id}`}
                                      name="server"
                                      value={server.id}
                                      checked={selectedServer === server.id}
                                      onChange={(e) => setSelectedServer(e.target.value)}
                                      disabled={server.status === 'inactive'}
                                      className="mt-1 mr-3"
                                    />
                                    <label htmlFor={`server-${server.id}`} className="flex-1 cursor-pointer">
                                      <div className="flex items-center mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold mr-3 ${server.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                          {server.id}
                                        </span>
                                        <span className="text-blue-600 font-semibold">
                                          {typeof server.price === 'number' && server.price >= 1000 
                                            ? `${server.price.toLocaleString()}đ/1 ${product.category === 'tiktok' ? 'tương tác' : 'tương tác'}`
                                            : `${server.price}đ/1 ${product.category === 'tiktok' ? 'tương tác' : 'tương tác'}`}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700 mb-1">{server.name}</p>
                                      <div className="text-xs text-gray-500">
                                        Tốc độ: {server.speed} | Min: {server.minOrder.toLocaleString()} | Max: {server.maxOrder.toLocaleString()}
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Quantity Input */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Số lượng: 
                              <span className="text-gray-500 text-xs ml-2">
                                ({(currentServer ? currentServer.minOrder : product.minOrder).toLocaleString()} ~ {(currentServer ? currentServer.maxOrder : product.maxOrder).toLocaleString()})
                              </span>
                            </label>
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(parseInt(e.target.value) || (currentServer ? currentServer.minOrder : product.minOrder))}
                              min={currentServer ? currentServer.minOrder : product.minOrder}
                              max={currentServer ? currentServer.maxOrder : product.maxOrder}
                              placeholder="Nhập số lượng"
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Số tiền mỗi tương tác:
                            </label>
                            <input
                              type="text"
                              value={typeof currentPrice === 'number' && currentPrice >= 1000 ? `${currentPrice.toLocaleString()}đ` : `${currentPrice}đ`}
                              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50"
                              readOnly
                            />
                          </div>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú:
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            maxLength={200}
                            placeholder="Nhập ghi chú nếu cần"
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                          />
                          <div className="text-xs text-gray-500 mt-1">{notes.length}/200 ký tự</div>
                        </div>

                        {/* Total Price */}
                        <div className="bg-blue-600 text-white p-4 rounded-lg text-center">
                          <p className="text-lg mb-2">
                            Tổng thanh toán: <span className="text-yellow-300 font-bold text-xl">{totalPrice.toLocaleString()}</span>đ
                          </p>
                          <p className="text-sm">
                            Bạn sẽ tăng <span className="text-yellow-300 font-semibold">{quantity.toLocaleString()}</span> số lượng với giá <span className="text-yellow-300 font-semibold">{typeof currentPrice === 'number' && currentPrice >= 1000 ? currentPrice.toLocaleString() : currentPrice}</span>đ
                          </p>
                        </div>

                        {/* Submit Button */}
                        <button
                          onClick={handleAddToCart}
                          disabled={isAdding || !targetUrl.trim() || (product.servers && product.servers.length > 0 && !selectedServer)}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                          {isAdding ? (
                            <>
                              <i className="ri-loader-4-line animate-spin mr-2"></i>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <i className="ri-shopping-cart-line mr-2"></i>
                              Tạo đơn hàng
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-4">
                      {/* Product Image */}
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        {productImage.type === 'image' ? (
                          <img
                            src={productImage.src}
                            alt={productImage.alt}
                            className={`mx-auto h-24 w-24 ${productImage.fit === 'cover' ? 'rounded-2xl object-cover' : 'object-contain'}`}
                          />
                        ) : (
                          <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                            <i className={`text-3xl ${productImage.iconClassName}`}></i>
                          </div>
                        )}

                        <h3 className="font-medium text-gray-900 mt-3">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                      </div>

                      {/* Features */}
                      {productFeatures.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <h3 className="font-semibold text-green-900 mb-3">Tính năng:</h3>
                          <ul className="text-sm text-green-800 space-y-1">
                            {productFeatures.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <i className="ri-check-line mr-2 mt-0.5 text-green-600"></i>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Instructions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-3">Hướng Dẫn & Ghi Chú:</h3>
                        <div className="text-sm text-blue-800 space-y-2">
                          {product.category === 'tiktok' && (
                            <>
                              <p>• Các máy chủ thuộc dịch vụ việt nam đều sử dụng nguồn tài khoản việt nam, một số máy chủ sẽ sử dụng người dùng thật</p>
                              <p>• Không đổi username tiktok trong quá trình tăng</p>
                              <p>• Mua bằng link các định dạng sau: ví dụ https://www.tiktok.com/@user_name hoặc https://vm.tiktok.com/TTPdMUTxmj/</p>
                            </>
                          )}
                          {product.category === 'software' && (
                            <>
                              <p>• Tài khoản được nâng cấp từ email của bạn</p>
                              <p>• Bảo hành full thời gian sử dụng</p>
                              <p>• Hỗ trợ 24/7 khi có vấn đề</p>
                            </>
                          )}
                          {![ 'tiktok', 'software'].includes(product.category) && (
                            <>
                              <p>• Dịch vụ chất lượng cao, từ tài khoản thật</p>
                              <p>• Tốc độ xử lý nhanh chóng</p>
                              <p>• Bảo hành không rớt</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Warnings */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="font-semibold text-red-900 mb-3">LƯU Ý!</h3>
                        <div className="text-sm text-red-800 space-y-2">
                          <p>• 1 ID không mua 2 đơn cùng lúc trong hệ thống ! đơn cũ hoàn thành mới mua đơn mới !</p>
                          <p>• Nghiêm cấm buff các đơn có nội dung vi phạm pháp luật, chính trị, đồ trụy...</p>
                          <p>• Nếu cố tình buff và bị phát hiện bạn sẽ bị trừ hết tiền và ban khỏi hệ thống vĩnh viễn</p>
                          <p>• Vui lòng kiểm tra link mua hoặc ID đúng trước khi mua</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="p-6">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="ri-file-list-3-line text-3xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-500">Lịch sử đơn hàng sẽ hiển thị tại đây sau khi bạn tạo đơn hàng đầu tiên</p>
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
