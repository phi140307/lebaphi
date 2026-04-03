'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAdminLoggedIn, getAdminSession } from '../../../lib/admin';
import { getUsers, updateUserBalance, getUserByDepositCode, updateUserDepositCode, generateDepositCode, createDepositTransaction } from '../../../lib/supabase';

interface DepositTransaction {
  id: string;
  depositCode: string;
  amount: number;
  userName: string;
  userEmail: string;
  currentBalance: number;
  timestamp: string;
  status: 'pending' | 'completed';
}

export default function AdminDepositsPage() {
  const [adminSession, setAdminSession] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchCode, setSearchCode] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [recentTransactions, setRecentTransactions] = useState<DepositTransaction[]>([]);
  const [showCodeManagement, setShowCodeManagement] = useState(false);
  const [pendingDeposits, setPendingDeposits] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra quyền admin
    if (!isAdminLoggedIn()) {
      router.push('/admin/login');
      return;
    }

    const session = getAdminSession();
    if (!session || !session.permissions?.deposits) {
      router.push('/admin/login');
      return;
    }

    setAdminSession(session);
    loadUsers();
    loadRecentTransactions();
    loadPendingDeposits();
  }, [router]);

  const loadUsers = async () => {
    try {
      const { data, error } = await getUsers();
      if (error) {
        console.error('Error loading users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  const loadPendingDeposits = () => {
    // Lấy danh sách yêu cầu nạp tiền chưa xử lý từ localStorage
    const storedDeposits = localStorage.getItem('pending_deposits');
    if (storedDeposits) {
      try {
        const deposits = JSON.parse(storedDeposits);
        setPendingDeposits(deposits.filter((d: any) => d.status === 'pending'));
      } catch (error) {
        console.error('Error loading pending deposits:', error);
      }
    }
  };

  const loadRecentTransactions = () => {
    const mockTransactions: DepositTransaction[] = [];
    setRecentTransactions(mockTransactions);
  };

  const handleDepositUpdate = async () => {
    if (!searchCode.trim()) {
      setMessage('Vui lòng nhập tên đăng nhập');
      setMessageType('error');
      return;
    }

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setMessage('Vui lòng nhập số tiền hợp lệ');
      setMessageType('error');
      return;
    }

    setIsProcessing(true);
    setMessage('');

    try {
      const user = users.find(u => u.username === searchCode.trim());

      if (!user) {
        setMessage('Không tìm thấy tên đăng nhập này trong hệ thống');
        setMessageType('error');
        setIsProcessing(false);
        return;
      }

      const currentBalance = user.balance || 0;
      const newBalance = currentBalance + parseFloat(depositAmount);

      const { error } = await updateUserBalance(user.id, newBalance);

      if (error) {
        setMessage('Lỗi cập nhật số dư: ' + error.message);
        setMessageType('error');
      } else {
        // Tạo giao dịch hoàn tất
        await createDepositTransaction({
          userId: user.id,
          amount: parseFloat(depositAmount),
          type: 'deposit',
          description: `Admin cộng tiền cho ${user.username}`,
          status: 'completed'
        });

        setMessage(`Đã cộng ${parseFloat(depositAmount).toLocaleString()}đ cho ${user.username}. Số dư mới: ${newBalance.toLocaleString()}đ`);
        setMessageType('success');

        const newTransaction: DepositTransaction = {
          id: Date.now().toString(),
          depositCode: searchCode.trim(),
          amount: parseFloat(depositAmount),
          userName: user.username,
          userEmail: user.email,
          currentBalance: newBalance,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };
        setRecentTransactions(prev => [newTransaction, ...prev.slice(0, 9)]);

        // Cập nhật trạng thái yêu cầu nạp tiền từ pending sang completed
        const storedDeposits = localStorage.getItem('pending_deposits');
        if (storedDeposits) {
          try {
            const deposits = JSON.parse(storedDeposits);
            const updatedDeposits = deposits.map((d: any) => {
              if (d.username === user.username && d.status === 'pending') {
                return { ...d, status: 'completed', processedAt: new Date().toISOString() };
              }
              return d;
            });
            localStorage.setItem('pending_deposits', JSON.stringify(updatedDeposits));

            // Cập nhật lịch sử nạp tiền cho user
            const userDeposits = localStorage.getItem(`user_deposits_${user.username}`) || '[]';
            const userDepositHistory = JSON.parse(userDeposits);
            const updatedUserHistory = userDepositHistory.map((d: any) => {
              if (d.status === 'pending' && d.amount === parseFloat(depositAmount)) {
                return { ...d, status: 'completed', processedAt: new Date().toISOString() };
              }
              return d;
            });
            localStorage.setItem(`user_deposits_${user.username}`, JSON.stringify(updatedUserHistory));

            loadPendingDeposits();
          } catch (error) {
            console.error('Error updating deposit status:', error);
          }
        }

        setSearchCode('');
        setDepositAmount('');
        loadUsers();
      }
    } catch (err) {
      setMessage('Có lỗi xảy ra khi cập nhật số dư');
      setMessageType('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateNewCode = async (user: any) => {
    try {
      const newCode = generateDepositCode(user.id);
      const { error } = await updateUserDepositCode(user.id, newCode);

      if (error) {
        alert('Lỗi tạo mã mới: ' + error.message);
      } else {
        alert(`Đã tạo mã mới cho ${user.username}: ${newCode}`);
        loadUsers();
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi tạo mã mới');
    }
  };

  const handleCreateCodeForUser = async (user: any) => {
    if (!user.deposit_code) {
      const newCode = generateDepositCode(user.id);
      const { error } = await updateUserDepositCode(user.id, newCode);

      if (error) {
        alert('Lỗi tạo mã: ' + error.message);
      } else {
        alert(`Đã tạo mã nạp tiền cho ${user.username}: ${newCode}`);
        loadUsers();
      }
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchCode.toLowerCase()) ||
    user.email.toLowerCase().includes(searchCode.toLowerCase())
  );

  const usersWithoutCode = users.filter(user => !user.deposit_code);

  if (!adminSession) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-gray-500 hover:text-gray-700">
                <i className="ri-arrow-left-line text-xl"></i>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản Lý Nạp Tiền</h1>
                <p className="text-sm text-gray-600">Admin: {adminSession.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <i className="ri-shield-check-line mr-1"></i>
                Admin Mode
              </div>
              <button
                onClick={() => setShowCodeManagement(!showCodeManagement)}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  showCodeManagement
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <i className="ri-settings-3-line mr-2"></i>
                Quản lý mã
              </button>
              <button
                onClick={() => {
                  loadUsers();
                  loadPendingDeposits();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
              >
                <i className="ri-refresh-line mr-2"></i>
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Toggle between modes */}
          <div className="mb-6">
            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowCodeManagement(false)}
                    className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      !showCodeManagement
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-money-dollar-circle-line mr-2"></i>
                    Cộng tiền
                  </button>
                  <button
                    onClick={() => setShowCodeManagement(true)}
                    className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      showCodeManagement
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <i className="ri-code-line mr-2"></i>
                    Quản lý mã nạp tiền
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  {showCodeManagement ? 'Tạo và quản lý mã nạp tiền' : 'Cộng tiền cho khách hàng'}
                </div>
              </div>
            </div>
          </div>

          {!showCodeManagement ? (
            // Deposit Mode
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Column - Deposit Update Form */}
              <div className="space-y-6">
                {/* Pending Deposits Alert */}
                {pendingDeposits.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <i className="ri-time-line text-yellow-600 text-xl mr-3"></i>
                      <h3 className="text-lg font-bold text-yellow-900">
                        Yêu cầu nạp tiền chờ xử lý ({pendingDeposits.length})
                      </h3>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {pendingDeposits.slice(0, 5).map((deposit) => (
                        <div key={deposit.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                          <div>
                            <div className="font-medium text-gray-900">{deposit.username}</div>
                            <div className="text-sm text-gray-500">{deposit.amount.toLocaleString()}đ</div>
                            <div className="text-xs text-gray-400">
                              {new Date(deposit.createdAt).toLocaleString('vi-VN')}
                            </div>
                          </div>
                          <div className="text-right">
                            <button
                              onClick={() => {
                                setSearchCode(deposit.username);
                                setDepositAmount(deposit.amount.toString());
                              }}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                            >
                              Xử lý ngay
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Deposit Update */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Cập Nhật Nạp Tiền</h2>

                  {message && (
                    <div
                      className={`mb-4 p-4 rounded-lg ${
                        messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                        placeholder="Nhập tên đăng nhập..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số tiền cộng <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Nhập số tiền..."
                        min="1000"
                        step="1000"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <button
                      onClick={handleDepositUpdate}
                      disabled={isProcessing || !searchCode.trim() || !depositAmount}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <i className="ri-loader-4-line animate-spin mr-2"></i>
                          Đang cập nhật...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <i className="ri-add-circle-line mr-2"></i>
                          Cộng tiền cho khách hàng
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                {/* User Search Results */}
                {searchCode && (
                  <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Kết quả tìm kiếm</h3>
                    {filteredUsers.length > 0 ? (
                      <div className="space-y-3">
                        {filteredUsers.slice(0, 5).map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{user.username}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{(user.balance || 0).toLocaleString()}đ</div>
                              <div className="text-sm text-gray-500">Số dư hiện tại</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Tên đăng nhập không tồn tại trên hệ thống!</p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column - Recent Transactions & Stats */}
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <i className="ri-money-dollar-circle-line text-green-600 text-lg"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">Hôm nay</p>
                        <p className="text-lg font-bold text-gray-900">0</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-sm border">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-wallet-3-line text-blue-600 text-lg"></i>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                        <p className="text-lg font-bold text-gray-900">0đ</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Giao Dịch Gần Đây</h3>
                  <div className="space-y-3">
                    {recentTransactions.length > 0 ? (
                      recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-900">{transaction.userName}</div>
                            <div className="text-sm text-gray-500">User: {transaction.depositCode}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(transaction.timestamp).toLocaleString('vi-VN')}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-green-600 font-bold">+{transaction.amount.toLocaleString()}đ</div>
                            <div className="text-sm text-gray-500">
                              Số dư: {transaction.currentBalance.toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <i className="ri-history-line text-3xl text-gray-300 mb-2"></i>
                        <p className="text-gray-500">Chưa có giao dịch nào hôm nay</p>
                        <p className="text-sm text-gray-400 mt-1">Giao dịch sẽ hiển thị khi admin cộng tiền cho khách hàng</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Code Management Mode - tương tự như trang cũ nhưng với kiểm tra admin
            <div className="space-y-8">
              {/* Code management content */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quản lý mã nạp tiền</h3>
                <p className="text-gray-600">Chức năng quản lý mã nạp tiền cho admin...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}