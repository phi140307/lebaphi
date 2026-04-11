export type PublicProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  minOrder: number;
  maxOrder: number;
  speed: string;
  quality: string;
  description: string;
  status: string;
  discount: number;
  features?: string[];
  servers?: Array<{
    id: string;
    name: string;
    price: number;
    minOrder: number;
    maxOrder: number;
    speed: string;
    status: string;
  }>;
};

export const publicProducts: PublicProduct[] = [
  { id: 1, name: 'Like TikTok Việt Nam', category: 'tiktok', price: 22, originalPrice: 33, minOrder: 100, maxOrder: 500000, speed: '0-30 phút', quality: 'Cao', description: 'Like TikTok Việt Nam chất lượng cao, tăng nhanh không rớt. Phù hợp cho video mới và cần tăng tương tác nhanh.', status: 'active', discount: 33 },
  { id: 2, name: 'Follow TikTok Real', category: 'tiktok', price: 179, originalPrice: 268, minOrder: 100, maxOrder: 100000, speed: '0-1 giờ', quality: 'Cao', description: 'Follow TikTok từ tài khoản thật 100%, không rớt, có avatar và hoạt động. Tăng uy tín profile.', status: 'active', discount: 33 },
  { id: 3, name: 'View TikTok Việt Nam', category: 'tiktok', price: 1, originalPrice: 2, minOrder: 100, maxOrder: 10000000, speed: '0-15 phút', quality: 'Trung bình', description: 'View TikTok Việt Nam giá rẻ nhất thị trường, tốc độ cực nhanh. Thích hợp cho video cần nhiều lượt xem.', status: 'active', discount: 50 },
  { id: 4, name: 'Share TikTok', category: 'tiktok', price: 6, originalPrice: 9, minOrder: 100, maxOrder: 200000, speed: '0-2 giờ', quality: 'Cao', description: 'Share TikTok tăng độ lan truyền video, giúp video được nhiều người xem hơn. Chia sẻ từ tài khoản thật.', status: 'active', discount: 33 },
  { id: 5, name: 'Comment TikTok Việt Nam', category: 'tiktok', price: 143, originalPrice: 214, minOrder: 100, maxOrder: 5000, speed: '0-6 giờ', quality: 'Cao', description: 'Comment TikTok từ tài khoản Việt Nam thật, nội dung tích cực phù hợp. Tăng tương tác chất lượng.', status: 'active', discount: 33 },
  { id: 6, name: 'Like Facebook Việt Nam', category: 'facebook', price: 44, originalPrice: 66, minOrder: 100, maxOrder: 100000, speed: '0-1 giờ', quality: 'Cao', description: 'Tăng like bài viết Facebook chất lượng cao, tốc độ nhanh. Tăng tương tác cho bài viết Facebook của bạn.', status: 'active', discount: 33 },
  { id: 7, name: 'Follow Facebook Page', category: 'facebook', price: 54, originalPrice: 81, minOrder: 100, maxOrder: 50000, speed: '0-2 giờ', quality: 'Cao', description: 'Follow Facebook Page từ tài khoản thật, tăng lượng theo dõi fanpage nhanh chóng.', status: 'active', discount: 33 },
  { id: 8, name: 'Share Facebook', category: 'facebook', price: 58, originalPrice: 87, minOrder: 100, maxOrder: 50000, speed: '0-3 giờ', quality: 'Trung bình', description: 'Tăng chia sẻ bài viết Facebook nhanh chóng, hiệu quả. Tăng độ lan truyền bài viết.', status: 'active', discount: 33 },
  { id: 9, name: 'Follow Instagram Real', category: 'instagram', price: 55, originalPrice: 82, minOrder: 100, maxOrder: 50000, speed: '0-6 giờ', quality: 'Cao', description: 'Follow Instagram thật 100%, không rớt. Tăng follower Instagram chất lượng cao.', status: 'active', discount: 33 },
  { id: 10, name: 'Like Instagram', category: 'instagram', price: 33, originalPrice: 49, minOrder: 100, maxOrder: 200000, speed: '0-1 giờ', quality: 'Cao', description: 'Like Instagram nhanh chóng, tăng tương tác cho bài đăng Instagram.', status: 'active', discount: 33 },
  { id: 11, name: 'View Instagram Story', category: 'instagram', price: 2, originalPrice: 3, minOrder: 100, maxOrder: 100000, speed: '0-30 phút', quality: 'Trung bình', description: 'View Instagram Story tăng lượt xem story, giúp tăng reach tự nhiên.', status: 'active', discount: 33 },
  { id: 12, name: 'Subscribe YouTube', category: 'youtube', price: 456, originalPrice: 681, minOrder: 100, maxOrder: 10000, speed: '0-12 giờ', quality: 'Cao', description: 'Subscribe YouTube chất lượng cao, bảo hành không rớt. Tăng subscriber nhanh.', status: 'active', discount: 33 },
  { id: 13, name: 'Like YouTube', category: 'youtube', price: 77, originalPrice: 115, minOrder: 100, maxOrder: 50000, speed: '0-2 giờ', quality: 'Cao', description: 'Like YouTube tăng tương tác video, giúp video được đề xuất nhiều hơn.', status: 'active', discount: 33 },
  { id: 14, name: 'View YouTube', category: 'youtube', price: 85, originalPrice: 127, minOrder: 1000, maxOrder: 1000000, speed: '0-6 giờ', quality: 'Cao', description: 'View YouTube chất lượng cao, giữ retention tốt. Phù hợp tăng view video dài hạn.', status: 'active', discount: 33 },
  { id: 15, name: 'Member Telegram', category: 'telegram', price: 94, originalPrice: 140, minOrder: 100, maxOrder: 50000, speed: '0-24 giờ', quality: 'Cao', description: 'Tăng member Telegram group/channel chất lượng cao.', status: 'active', discount: 33 },
  { id: 16, name: 'View Telegram Post', category: 'telegram', price: 13, originalPrice: 19, minOrder: 100, maxOrder: 100000, speed: '0-2 giờ', quality: 'Trung bình', description: 'Tăng view bài viết Telegram nhanh, giá tốt.', status: 'active', discount: 32 },
  { id: 17, name: 'Reaction Telegram', category: 'telegram', price: 66, originalPrice: 98, minOrder: 100, maxOrder: 10000, speed: '0-4 giờ', quality: 'Cao', description: 'Tăng reaction cho bài viết Telegram.', status: 'active', discount: 33 },
  { id: 18, name: 'Follow Shopee', category: 'shopee', price: 133, originalPrice: 198, minOrder: 100, maxOrder: 10000, speed: '0-12 giờ', quality: 'Cao', description: 'Tăng follow shop Shopee từ tài khoản thật.', status: 'active', discount: 33 },
  { id: 19, name: 'Đánh Giá Shop Shopee', category: 'shopee', price: 2500, originalPrice: 3500, minOrder: 1, maxOrder: 1000, speed: '1-3 ngày', quality: 'Cao', description: 'Tăng đánh giá shop Shopee chất lượng, kèm nội dung tự nhiên.', status: 'active', discount: 29 },
  { id: 20, name: 'Đánh Giá Sản Phẩm Shopee', category: 'shopee', price: 3000, originalPrice: 4200, minOrder: 1, maxOrder: 1000, speed: '1-3 ngày', quality: 'Cao', description: 'Tăng đánh giá cho sản phẩm Shopee, hỗ trợ ảnh và nội dung.', status: 'active', discount: 29 },
  { id: 21, name: 'Like Sản Phẩm Shopee', category: 'shopee', price: 30, originalPrice: 45, minOrder: 100, maxOrder: 20000, speed: '0-4 giờ', quality: 'Cao', description: 'Like sản phẩm Shopee tăng tương tác, giúp sản phẩm nổi bật hơn.', status: 'active', discount: 33 },
  { id: 22, name: 'ChatGPT Plus (1 tháng)', category: 'ai', price: 99000, originalPrice: 150000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Nâng cấp ChatGPT Plus dùng trong 1 tháng.', status: 'active', discount: 34 },
  { id: 23, name: 'Perplexity Pro (1 tháng)', category: 'ai', price: 59000, originalPrice: 90000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản Perplexity Pro hỗ trợ tìm kiếm AI nâng cao trong 1 tháng.', status: 'active', discount: 34 },
  { id: 24, name: 'Perplexity Pro (12 tháng)', category: 'ai', price: 390000, originalPrice: 550000, minOrder: 1, maxOrder: 5, speed: '0-4 giờ', quality: 'Cao', description: 'Tài khoản Perplexity Pro thời hạn 1 năm.', status: 'active', discount: 29 },
  { id: 25, name: 'ChatGPT Team (1 tháng)', category: 'ai', price: 149000, originalPrice: 220000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản ChatGPT Team dùng chung nhóm trong 1 tháng.', status: 'active', discount: 32 },
  { id: 26, name: 'ChatGPT Pro (1 tháng)', category: 'ai', price: 179000, originalPrice: 260000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản ChatGPT Pro với nhiều giới hạn cao hơn.', status: 'active', discount: 31 },
  { id: 27, name: 'Claude Pro (1 tháng)', category: 'ai', price: 149000, originalPrice: 220000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản Claude Pro thời hạn 1 tháng.', status: 'active', discount: 32 },
  { id: 28, name: 'Grok Premium (1 tháng)', category: 'ai', price: 119000, originalPrice: 170000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản Grok Premium thời hạn 1 tháng.', status: 'active', discount: 30 },
  { id: 29, name: 'Grok Super (3 tháng)', category: 'ai', price: 330000, originalPrice: 470000, minOrder: 1, maxOrder: 5, speed: '0-4 giờ', quality: 'Cao', description: 'Tài khoản Grok Super thời hạn 3 tháng.', status: 'active', discount: 30 },
  { id: 30, name: 'Grok Super (6 tháng)', category: 'ai', price: 630000, originalPrice: 900000, minOrder: 1, maxOrder: 5, speed: '0-4 giờ', quality: 'Cao', description: 'Tài khoản Grok Super thời hạn 6 tháng.', status: 'active', discount: 30 },
  { id: 31, name: 'Grok Super (12 tháng)', category: 'ai', price: 970000, originalPrice: 1400000, minOrder: 1, maxOrder: 5, speed: '0-4 giờ', quality: 'Cao', description: 'Tài khoản Grok Super thời hạn 12 tháng.', status: 'active', discount: 30 },
  { id: 32, name: 'Google Gemini Pro (1 tháng)', category: 'ai', price: 115000, originalPrice: 165000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Nâng cấp Google Gemini Pro thời hạn 1 tháng.', status: 'active', discount: 30 },
  { id: 33, name: 'Google Gemini Pro + 2TB Drive (1 năm)', category: 'ai', price: 140000, originalPrice: 200000, minOrder: 1, maxOrder: 5, speed: '0-4 giờ', quality: 'Cao', description: 'Gói năm kèm theo 2TB dung lượng Google Drive lưu trữ.', status: 'active', discount: 30 },
  { id: 34, name: 'Leonardo AI (1 tháng)', category: 'ai', price: 350000, originalPrice: 500000, minOrder: 1, maxOrder: 10, speed: '0-4 giờ', quality: 'Cao', description: 'Tài khoản Leonardo AI 1 tháng. Mức giá dao động 350k - 420k tùy gói.', status: 'active', discount: 30 },
  { id: 35, name: 'Kling AI - 1100 Credit (1 tháng)', category: 'ai', price: 230000, originalPrice: 330000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản Kling AI kèm 1100 Credit sử dụng trong 1 tháng.', status: 'active', discount: 30 },
  { id: 36, name: 'Canva Edu (1 năm)', category: 'design', price: 70000, originalPrice: 100000, minOrder: 1, maxOrder: 10, speed: '0-1 giờ', quality: 'Cao', description: 'Tài khoản Canva Edu thời hạn 1 năm.', status: 'active', discount: 30 },
  { id: 37, name: 'Canva Edu (3 năm)', category: 'design', price: 105000, originalPrice: 150000, minOrder: 1, maxOrder: 10, speed: '0-1 giờ', quality: 'Cao', description: 'Tài khoản Canva Edu siêu tiết kiệm thời hạn 3 năm.', status: 'active', discount: 30 },
  { id: 38, name: 'Canva Pro Chuẩn (1 tháng)', category: 'design', price: 15000, originalPrice: 25000, minOrder: 1, maxOrder: 20, speed: '0-1 giờ', quality: 'Cao', description: 'Tài khoản Canva Pro chuẩn thời hạn 1 tháng.', status: 'active', discount: 40 },
  { id: 39, name: 'Canva Pro Chuẩn (12 tháng)', category: 'design', price: 175000, originalPrice: 250000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản Canva Pro chuẩn thời hạn 12 tháng.', status: 'active', discount: 30 },
  { id: 40, name: 'CapCut Pro Cấp lẻ (1 tháng)', category: 'design', price: 50000, originalPrice: 75000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Cấp quyền dùng CapCut Pro 1 tháng.', status: 'active', discount: 33 },
  { id: 41, name: 'CapCut Pro Cấp lẻ (3 tháng)', category: 'design', price: 130000, originalPrice: 190000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Cấp quyền dùng CapCut Pro 3 tháng.', status: 'active', discount: 31 },
  { id: 42, name: 'CapCut Pro Cấp lẻ (6 tháng)', category: 'design', price: 240000, originalPrice: 350000, minOrder: 1, maxOrder: 5, speed: '0-2 giờ', quality: 'Cao', description: 'Cấp quyền dùng CapCut Pro 6 tháng.', status: 'active', discount: 31 },
  { id: 43, name: 'CapCut Pro Cấp lẻ (1 năm)', category: 'design', price: 340000, originalPrice: 500000, minOrder: 1, maxOrder: 5, speed: '0-2 giờ', quality: 'Cao', description: 'Cấp quyền dùng CapCut Pro 1 năm.', status: 'active', discount: 32 },
  { id: 44, name: 'CapCut Pro Full Acc (6 tháng)', category: 'design', price: 420000, originalPrice: 600000, minOrder: 1, maxOrder: 5, speed: '0-4 giờ', quality: 'Cao', description: 'Giao toàn quyền (Full acc) CapCut Pro trong 6 tháng.', status: 'active', discount: 30 },
  { id: 45, name: 'CapCut Pro Full Acc (1 năm)', category: 'design', price: 560000, originalPrice: 800000, minOrder: 1, maxOrder: 3, speed: '0-4 giờ', quality: 'Cao', description: 'Giao toàn quyền (Full acc) CapCut Pro trong 1 năm.', status: 'active', discount: 30 },
  { id: 46, name: 'Adobe (6 tháng)', category: 'design', price: 350000, originalPrice: 500000, minOrder: 1, maxOrder: 5, speed: '0-6 giờ', quality: 'Cao', description: 'Tài khoản ứng dụng Adobe thời hạn 6 tháng.', status: 'active', discount: 30 },
  { id: 47, name: 'Meitu VIP (1 tháng)', category: 'design', price: 125000, originalPrice: 180000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Nâng cấp Meitu VIP sử dụng full tính năng trong 1 tháng.', status: 'active', discount: 30 },
  { id: 48, name: 'YouTube Premium (1 tháng)', category: 'entertainment', price: 40000, originalPrice: 60000, minOrder: 1, maxOrder: 10, speed: '0-1 giờ', quality: 'Cao', description: 'Nâng cấp YouTube Premium không quảng cáo 1 tháng.', status: 'active', discount: 33 },
  { id: 49, name: 'YouTube Premium (6 tháng)', category: 'entertainment', price: 210000, originalPrice: 300000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Nâng cấp YouTube Premium không quảng cáo 6 tháng.', status: 'active', discount: 30 },
  { id: 50, name: 'YouTube Premium (12 tháng)', category: 'entertainment', price: 460000, originalPrice: 650000, minOrder: 1, maxOrder: 5, speed: '0-2 giờ', quality: 'Cao', description: 'Nâng cấp YouTube Premium không quảng cáo 12 tháng.', status: 'active', discount: 29 },
  { id: 51, name: 'Netflix (1 tháng)', category: 'entertainment', price: 50000, originalPrice: 75000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản Netflix 1 tháng (Giá dao động 50k - 125k tùy loại: Dùng chung / Riêng / Farm).', status: 'active', discount: 33 },
  { id: 52, name: 'Spotify Premium (6 tháng)', category: 'entertainment', price: 390000, originalPrice: 550000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Nâng cấp Spotify Premium chính chủ thời hạn 6 tháng.', status: 'active', discount: 29 },
  { id: 53, name: 'Spotify Premium (12 tháng)', category: 'entertainment', price: 540000, originalPrice: 770000, minOrder: 1, maxOrder: 5, speed: '0-2 giờ', quality: 'Cao', description: 'Nâng cấp Spotify Premium chính chủ thời hạn 12 tháng.', status: 'active', discount: 30 },
  { id: 54, name: 'Microsoft Office 365 + 1TB (1 năm)', category: 'microsoft', price: 210000, originalPrice: 300000, minOrder: 1, maxOrder: 10, speed: '0-4 giờ', quality: 'Cao', description: 'Bộ công cụ Office 365 kèm 1TB OneDrive thời hạn 1 năm.', status: 'active', discount: 30 },
  { id: 55, name: 'Quizlet Plus (1 tháng)', category: 'education', price: 40000, originalPrice: 60000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản học tập Quizlet Plus thời hạn 1 tháng.', status: 'active', discount: 33 },
  { id: 56, name: 'Quizlet Plus (12 tháng)', category: 'education', price: 210000, originalPrice: 300000, minOrder: 1, maxOrder: 5, speed: '0-2 giờ', quality: 'Cao', description: 'Tài khoản học tập Quizlet Plus thời hạn 12 tháng.', status: 'active', discount: 30 },
  { id: 57, name: 'Duolingo Super (12 tháng)', category: 'education', price: 390000, originalPrice: 550000, minOrder: 1, maxOrder: 5, speed: '0-2 giờ', quality: 'Cao', description: 'Nâng cấp học ngoại ngữ Duolingo Super thời hạn 1 năm.', status: 'active', discount: 29 },
  { id: 58, name: 'Grammarly Premium (1 tháng)', category: 'education', price: 210000, originalPrice: 300000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Công cụ sửa lỗi ngữ pháp tiếng Anh Grammarly Premium 1 tháng.', status: 'active', discount: 30 },
  { id: 59, name: 'Locket Gold (Vĩnh viễn)', category: 'premium', price: 65000, originalPrice: 100000, minOrder: 1, maxOrder: 10, speed: '0-2 giờ', quality: 'Cao', description: 'Locket Gold dùng vĩnh viễn (Bảo hành 1 năm).', status: 'active', discount: 35 },
];

export function getPublicProductById(id: number) {
  return publicProducts.find((product) => product.id === id);
}

export function getProductFeatures(product: PublicProduct) {
  return [
    `${product.name}`,
    `Thoi gian xu ly: ${product.speed}`,
    `So luong toi thieu: ${product.minOrder}`,
    `So luong toi da: ${product.maxOrder}`,
    `Chat luong: ${product.quality}`,
  ];
}
