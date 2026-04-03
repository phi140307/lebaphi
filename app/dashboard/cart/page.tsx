
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cartManager, CartItem } from '../../../lib/cart';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const updateItems = () => {
      setItems(cartManager.getItems());
      setIsLoading(false);
    };

    updateItems();
    const unsubscribe = cartManager.subscribe(updateItems);

    return unsubscribe;
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    cartManager.updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      cartManager.removeItem(itemId);
    }
  };

  const handleClearCart = () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      cartManager.clear();
    }
  };

  const handleCheckout = () => {
    // Check if user is logged in
    const userSession = localStorage.getItem('user_session');
    if (!userSession) {
      setShowLoginModal(true);
      return;
    }

    // Proceed to checkout
    router.push('/dashboard/checkout');
  };

  const totalAmount = cartManager.getTotalAmount();
  const totalItems = cartManager.getTotalItems();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-4xl text-orange-600 mb-4"></i>
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shopee Style Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Link href="/dashboard/products" className="text-white hover:text-purple-200">
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <div className="text-white font=['Pacifico'] text-xl">logo</div>
            <div className="flex-1 text-center">
              <span className="text-white text-sm">Giỏ hàng ({totalItems})</span>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-white hover:text-purple-200 text-sm"
              >
                Xóa tất cả
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-shopping-cart-line text-4xl text-gray-400"></i>
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-8">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm
            </p>
            <Link
              href="/dashboard/products"
              className="inline-flex items-center bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded hover:from-purple-600 hover:to-blue-600 transition-colors font-medium"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Cart Items */}
            <div className="bg-white rounded shadow-sm mb-4">
              <div className="p-4 border-b">
                <h2 className="font-medium">Sản phẩm</h2>
              </div>

              <div className="divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Product Icon */}
                      <div
                        className={`w-20 h-20 rounded flex items-center justify-center flex-shrink-0 ${
                          item.category === 'facebook'
                            ? 'bg-blue-100'
                            : item.category === 'instagram'
                            ? 'bg-pink-100'
                            : item.category === 'tiktok'
                            ? 'bg-gray-100'
                            : item.category === 'youtube'
                            ? 'bg-red-100'
                            : item.category === 'design'
                            ? 'bg-purple-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        {item.category === 'design' && (item.productId === 23 || item.productId === 24) ? (
                          <img
                            src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/d85a64c4610bb2bdbb8d01a2e3cc28ab.png"
                            alt="Canva Logo"
                            className="w-full h-full object-contain p-2"
                          />
                        ) : item.category === 'software' && (item.productId === 28 || item.productId === 29 || item.productId === 30) ? (
                          <img
                            src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/0a9282b6d6e94800abba3307d6371f07.png"
                            alt="CapCut Logo"
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <i
                            className={`text-3xl ${
                              item.category === 'facebook'
                                ? 'ri-facebook-fill text-blue-600'
                                : item.category === 'instagram'
                                ? 'ri-instagram-line text-pink-600'
                                : item.category === 'tiktok'
                                ? 'ri-tiktok-line text-gray-700'
                                : item.category === 'youtube'
                                ? 'ri-youtube-line text-red-600'
                                : 'ri-apps-line text-gray-600'
                            }`}
                          ></i>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-500 capitalize mb-2">{item.category}</p>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          <span className="font-medium">URL:</span> {item.targetUrl}
                        </p>
                        {item.notes && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Ghi chú:</span> {item.notes}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-purple-600 font-medium text-lg">
                        {(item.price * item.quantity).toLocaleString()}đ
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">Số lượng:</span>
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="ri-subtract-line text-sm"></i>
                          </button>
                          <span className="px-4 py-1 text-sm min-w-[60px] text-center">
                            {item.quantity.toLocaleString()}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="px-3 py-1 hover:bg-gray-100"
                          >
                            <i className="ri-add-line text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm):</span>
                <span className="text-lg font-medium">₫{totalAmount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="text-green-600">Miễn phí</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Tổng cộng:</span>
                  <span className="text-2xl font-medium text-orange-500">
                    ₫{totalAmount.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded hover:from-purple-600 hover:to-blue-600 transition-colors font-medium"
                >
                  Mua Hàng ({totalItems})
                </button>
              </div>
            </div>
          </div>
        )}
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
                Trước tiên bạn cần đăng nhập để thanh toán đơn hàng!
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/"
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
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
