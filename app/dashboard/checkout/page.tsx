'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SePayPgClient } from 'sepay-pg-node';
import { cartManager } from '../../../lib/cart';
import { createOrder } from '../../../lib/orders';
import { processPayment, getUserById, supabase } from '../../../lib/supabase';

const sepayClient = new SePayPgClient({
  env: 'sandbox',
  merchant_id: process.env.NEXT_PUBLIC_SEPAY_MERCHANT_ID || 'MERCHANT_ID',
  secret_key: process.env.NEXT_PUBLIC_SEPAY_SECRET_KEY || 'SECRET_KEY'
});

interface UserData {
  id: string;
  username: string;
  email: string;
  balance?: number;
  fullName?: string;
  total_spent?: number;
}

export default function CheckoutPage() {
  const [items, setItems] = useState(cartManager.getItems());
  const [paymentMethod, setPaymentMethod] = useState<'sepay'>('sepay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserData>({
    id: 'user_demo_123',
    username: 'demo_user',
    email: 'demo@example.com',
  });
  const router = useRouter();

  const totalAmount = cartManager.getTotalAmount();
  const hasEnoughBalance = userBalance >= totalAmount;

  useEffect(() => {
    if (items.length === 0) {
      router.push('/dashboard/cart');
    }
    loadUserData();
  }, [items, router]);

  const loadUserData = async () => {
    try {
      // Lấy thông tin người dùng từ localStorage
      const userSession = localStorage.getItem('user_session');
      if (userSession) {
        const userData: UserData = JSON.parse(userSession);
        setCurrentUser(userData);

        // Thử lấy số dư từ database
        try {
          const { data, error } = await getUserById(userData.id);
          if (!error && data) {
            setUserBalance(data.balance || 0);
            // Cập nhật localStorage với số dư mới nhất
            userData.balance = data.balance || 0;
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
        const demoUser: UserData = {
          id: 'user_demo_123',
          username: 'demo_user',
          email: 'demo@example.com',
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
      const demoUser: UserData = {
        id: 'user_demo_123',
        username: 'demo_user',
        email: 'demo@example.com',
        balance: demoBalance
      };

      setUserBalance(demoBalance);
      setCurrentUser(demoUser);
      localStorage.setItem('user_session', JSON.stringify(demoUser));
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const orderData = {
      id: orderId,
      user_id: currentUser.id,
      items: items,
      total_amount: totalAmount,
      payment_method: 'sepay',
      status: 'processing' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('orders').insert([orderData]);
      if (error) {
        console.log('Lưu đơn hàng thất bại, dùng localStorage');
        localStorage.setItem('pending_order', JSON.stringify(orderData));
      } else {
        console.log('Đơn hàng đã lưu vào database');
      }
    } catch (e) {
      localStorage.setItem('pending_order', JSON.stringify(orderData));
    }

    const checkoutURL = sepayClient.checkout.initCheckoutUrl();
    const checkoutFormfields = sepayClient.checkout.initOneTimePaymentFields({
      payment_method: 'BANK_TRANSFER',
      order_invoice_number: orderId,
      order_amount: totalAmount,
      currency: 'VND',
      order_description: `Thanh toán đơn hàng ${orderId}`,
      success_url: `${window.location.origin}/dashboard/orders/success?payment=success&orderId=${orderId}`,
      error_url: `${window.location.origin}/dashboard/checkout?payment=error`,
      cancel_url: `${window.location.origin}/dashboard/checkout?payment=cancel`,
    });

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = checkoutURL;
    
    Object.entries(checkoutFormfields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
  };

  if (items.length === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-blue-600 mb-4"></i>
          <p className="text-gray-600">Đang tải thông tin thanh toán...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/cart" className="text-gray-500 hover:text-gray-700">
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Review */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Xem lại đơn hàng</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.category === 'facebook'
                            ? 'bg-blue-100'
                            : item.category === 'instagram'
                            ? 'bg-pink-100'
                            : item.category === 'tiktok'
                            ? 'bg-gray-100'
                            : item.category === 'design'
                            ? 'bg-purple-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        {item.category === 'design' && (item.productId === 23 || item.productId === 24) ? (
                          <img
                            src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/d85a64c4610bb2bdbb8d01a2e3cc28ab.png"
                            alt="Canva Logo"
                            className="w-8 h-8 object-contain"
                          />
                        ) : (
                          <i
                            className={` ${
                              item.category === 'facebook'
                                ? 'ri-facebook-fill text-blue-600'
                                : item.category === 'instagram'
                                ? 'ri-instagram-line text-pink-600'
                                : item.category === 'tiktok'
                                ? 'ri-tiktok-line text-gray-700'
                                : 'ri-apps-line text-gray-600'
                            } text-xl`}
                          ></i>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 truncate">URL: {item.targetUrl}</p>
                        <p className="text-sm text-gray-600">
                          {item.price}đ x {item.quantity.toLocaleString()} ={' '}
                          {(item.price * item.quantity).toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Phương thức thanh toán</h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      id="sepay"
                      name="payment"
                      value="sepay"
                      checked={paymentMethod === 'sepay'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'sepay')}
                      className="mt-1"
                    />
                    <label htmlFor="sepay" className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Thanh toán qua SePay</div>
                          <div className="text-sm text-gray-500">
                            Hỗ trợ chuyển khoản ngân hàng
                          </div>
                        </div>
                        <i className="ri-bank-card-line text-2xl text-blue-600"></i>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Tổng đơn hàng</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số sản phẩm:</span>
                    <span className="font-medium">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">{totalAmount.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí xử lý:</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Tổng cộng:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {totalAmount.toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing || (paymentMethod === 'balance' && !hasEnoughBalance)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <i className={paymentMethod === 'sepay' ? 'ri-bank-card-line mr-2' : 'ri-secure-payment-line mr-2'}></i>
                      {paymentMethod === 'sepay' ? 'Thanh toán với SePay' : 'Xác nhận thanh toán'}
                    </div>
                  )}
                </button>

                

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="ri-shield-check-line text-green-600 mr-2"></i>
                    Thanh toán an toàn và bảo mật
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}