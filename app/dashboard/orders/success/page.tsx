
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-check-line text-4xl text-green-600"></i>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Đặt hàng thành công!</h1>
        
        <p className="text-gray-600 mb-8">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý và sẽ được hoàn thành trong thời gian sớm nhất.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard/orders"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center block whitespace-nowrap"
          >
            <i className="ri-file-list-line mr-2"></i>
            Xem đơn hàng
          </Link>
          
          <Link
            href="/dashboard/products"
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block whitespace-nowrap"
          >
            <i className="ri-shopping-bag-line mr-2"></i>
            Tiếp tục mua sắm
          </Link>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <i className="ri-information-line mr-1"></i>
            Tự động chuyển đến trang đơn hàng sau {countdown} giây
          </p>
        </div>
      </div>
    </div>
  );
}
