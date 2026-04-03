
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DepositHistory {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  bonusAmount: number;
}

interface UserSession {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  balance?: number;
  loginTime: number;
}

const getBonusAmount = (amount: number): number => {
  if (amount >= 1000000) return Math.floor(amount * 0.1);
  if (amount >= 500000) return Math.floor(amount * 0.05);
  if (amount >= 100000) return Math.floor(amount * 0.02);
  return 0;
};

export default function DepositPage() {
  const [amount, setAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('bank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [depositHistory, setDepositHistory] = useState<DepositHistory[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [pendingDeposit, setPendingDeposit] = useState<DepositHistory | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userSession = localStorage.getItem('user_session');
      if (!userSession) {
        router.push('/login');
        return;
      }

      try {
        const userData = JSON.parse(userSession) as UserSession;
        setCurrentUser(userData);
        loadDepositHistory(userData.username);
      } catch (error) {
        console.error('Error parsing user session:', error);
        router.push('/login');
      }
    }
  }, [router]);

  const loadDepositHistory = (username: string): void => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem(`user_deposits_${username}`);
      if (history) {
        try {
          const deposits = JSON.parse(history) as DepositHistory[];
          setDepositHistory(deposits.sort((a: DepositHistory, b: DepositHistory) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        } catch (error) {
          console.error('Error loading deposit history:', error);
        }
      }
    }
  };

  const handleDeposit = async (): Promise<void> => {
    if (!amount || parseInt(amount) < 10000) {
      alert('Số tiền nạp tối thiểu là 10,000đ');
      return;
    }

    if (!currentUser) {
      alert('Vui lòng đăng nhập lại');
      return;
    }

    setIsProcessing(true);

    try {
      const depositRequest: DepositHistory = {
        id: Date.now().toString(),
        amount: parseInt(amount),
        status: 'pending',
        createdAt: new Date().toISOString(),
        bonusAmount: getBonusAmount(parseInt(amount))
      };

      const existingHistory = depositHistory;
      const newHistory = [depositRequest, ...existingHistory];
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(`user_deposits_${currentUser.username}`, JSON.stringify(newHistory));
        
        const pendingDeposits = localStorage.getItem('pending_deposits') || '[]';
        const pendingList = JSON.parse(pendingDeposits) as any[];
        
        const newPendingDeposit = {
          id: depositRequest.id,
          username: currentUser.username,
          amount: parseInt(amount),
          bonusAmount: getBonusAmount(parseInt(amount)),
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        pendingList.push(newPendingDeposit);
        localStorage.setItem('pending_deposits', JSON.stringify(pendingList));
      }

      setDepositHistory(newHistory);
      setPendingDeposit(depositRequest);
      setShowSuccessModal(true);
      setAmount('');
    } catch (error) {
      console.error('Error processing deposit:', error);
      alert('Có lỗi xảy ra khi xử lý yêu cầu nạp tiền');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentAmount = parseInt(amount || '0');
  const bonusAmount = getBonusAmount(currentAmount);
  const totalReceived = currentAmount + bonusAmount;

  if (!currentUser) {
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
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nạp Tiền</h1>
                <p className="text-sm text-gray-600">Tài khoản: {currentUser.username}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Số dư hiện tại</p>
              <p className="text-2xl font-bold text-blue-600">{(currentUser.balance || 0).toLocaleString()}đ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Thông Tin Nạp Tiền</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền nạp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Nhập số tiền..."
                      min="10000"
                      step="1000"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Số tiền tối thiểu: 10,000đ</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phương thức thanh toán
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-8"
                    >
                      <option value="bank">Chuyển khoản ngân hàng</option>
                      <option value="momo">MoMo</option>
                      <option value="zalopay">ZaloPay</option>
                    </select>
                  </div>

                  {currentAmount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <i className="ri-gift-line text-green-600 mr-2"></i>
                        <h3 className="font-medium text-green-900">Thông tin khuyến mãi</h3>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Số tiền nạp:</span>
                          <span className="font-medium">{currentAmount.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tiền thưởng:</span>
                          <span className="font-medium text-green-600">+{bonusAmount.toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-green-200 pt-1">
                          <span>Tổng nhận được:</span>
                          <span className="text-green-600">{totalReceived.toLocaleString()}đ</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleDeposit}
                    disabled={isProcessing || !amount || parseInt(amount) < 10000}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Đang xử lý...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <i className="ri-money-dollar-circle-line mr-2"></i>
                        Tạo yêu cầu nạp tiền
                      </div>
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Chương Trình Khuyến Mãi</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <i className="ri-medal-line text-yellow-600 mr-2"></i>
                      <span>Nạp từ 100,000đ</span>
                    </div>
                    <span className="font-bold text-yellow-600">+2%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <i className="ri-medal-line text-orange-600 mr-2"></i>
                      <span>Nạp từ 500,000đ</span>
                    </div>
                    <span className="font-bold text-orange-600">+5%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <i className="ri-vip-crown-line text-red-600 mr-2"></i>
                      <span>Nạp từ 1,000,000đ</span>
                    </div>
                    <span className="font-bold text-red-600">+10%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Lịch Sử Nạp Tiền</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {depositHistory.length > 0 ? (
                    depositHistory.map((deposit) => (
                      <div key={deposit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">
                            {deposit.amount.toLocaleString()}đ
                            {deposit.bonusAmount > 0 && (
                              <span className="text-green-600 text-sm ml-2">
                                (+{deposit.bonusAmount.toLocaleString()}đ)
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(deposit.createdAt).toLocaleString('vi-VN')}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {deposit.status === 'pending' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs whitespace-nowrap">
                              <i className="ri-time-line mr-1"></i>
                              Đang xử lý
                            </span>
                          )}
                          {deposit.status === 'completed' && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs whitespace-nowrap">
                              <i className="ri-check-line mr-1"></i>
                              Thành công
                            </span>
                          )}
                          {deposit.status === 'failed' && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs whitespace-nowrap">
                              <i className="ri-close-line mr-1"></i>
                              Thất bại
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <i className="ri-history-line text-3xl text-gray-300 mb-2"></i>
                      <p className="text-gray-500">Chưa có lịch sử nạp tiền</p>
                      <p className="text-sm text-gray-400 mt-1">Hãy thực hiện nạp tiền đầu tiên</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Hướng Dẫn Nạp Tiền</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <i className="ri-number-1 text-blue-600 mr-2 mt-0.5"></i>
                    <span>Nhập số tiền muốn nạp (tối thiểu 10,000đ)</span>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-number-2 text-blue-600 mr-2 mt-0.5"></i>
                    <span>Chọn phương thức thanh toán phù hợp</span>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-number-3 text-blue-600 mr-2 mt-0.5"></i>
                    <span>Bấm "Tạo yêu cầu nạp tiền" và làm theo hướng dẫn</span>
                  </div>
                  <div className="flex items-start">
                    <i className="ri-number-4 text-blue-600 mr-2 mt-0.5"></i>
                    <span>Tiền sẽ được cộng vào tài khoản sau khi admin xác nhận</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && pendingDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-2xl text-green-600"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Yêu Cầu Nạp Tiền Thành Công!</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-6">
                <p>Số tiền: <span className="font-medium">{pendingDeposit.amount.toLocaleString()}đ</span></p>
                {pendingDeposit.bonusAmount > 0 && (
                  <p>Tiền thưởng: <span className="font-medium text-green-600">+{pendingDeposit.bonusAmount.toLocaleString()}đ</span></p>
                )}
                <p>Tổng nhận: <span className="font-medium text-blue-600">{(pendingDeposit.amount + pendingDeposit.bonusAmount).toLocaleString()}đ</span></p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <i className="ri-information-line mr-1"></i>
                  Yêu cầu của bạn đang chờ admin xử lý. Tiền sẽ được cộng vào tài khoản sau khi xác nhận.
                </p>
              </div>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
