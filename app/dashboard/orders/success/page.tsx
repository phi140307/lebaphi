
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { cartManager } from '../../../../lib/cart';

export default function OrderSuccessPage() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');

  useEffect(() => {
    const orderIdParam = searchParams.get('orderId');
    const paymentParam = searchParams.get('payment');
    
    if (orderIdParam) {
      setOrderId(orderIdParam);
      setPaymentStatus(paymentParam || 'pending');
      console.log('Order created:', orderIdParam, 'Payment status:', paymentParam);
      cartManager.clear();
      localStorage.removeItem('pending_order');
    }
  }, [searchParams]);

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
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Đơn hàng đã được tạo!</h1>
        
        <p className="text-gray-600 mb-4">
          Vui lòng hoàn tất thanh toán qua ngân hàng. Đơn hàng sẽ được xác nhận sau khi thanh toán thành công.
        </p>

        {orderId && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">Mã đơn hàng:</p>
            <p className="font-mono font-bold text-gray-900">{orderId}</p>
          </div>
        )}
        
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
