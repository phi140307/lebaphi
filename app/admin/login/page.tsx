
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '../../../lib/admin';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage('Vui lòng nhập đầy đủ thông tin đăng nhập');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      const sessionData = await adminLogin(username, password);
      
      if (!sessionData) {
        setMessage('Tài khoản hoặc mật khẩu không chính xác');
        setMessageType('error');
      } else {
        setMessage('Đăng nhập thành công! Đang chuyển hướng...');
        setMessageType('success');
        
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      }
    } catch (err) {
      setMessage('Có lỗi xảy ra khi đăng nhập');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo Admin */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <img
                src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/1d687c24a1bdcffbd40d0977605df9ec.png"
                alt="Lê Bá Phi Logo"
                className="w-12 h-12 rounded-lg object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Đăng nhập hệ thống quản lý</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-lg text-sm ${messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                {message}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Tài khoản Admin
              </label>
              <div className="relative">
                <i className="ri-user-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tài khoản admin"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <i className="ri-lock-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <i className="ri-loader-4-line animate-spin mr-2"></i>
                  Đang đăng nhập...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="ri-login-circle-line mr-2"></i>
                  Đăng nhập Admin
                </div>
              )}
            </button>
          </form>

          {/* Default Account Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Tài khoản mặc định:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Username: <strong>...</strong></p>
              <p>• Password: <strong>...</strong></p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              <i className="ri-information-line mr-1"></i>
              Vui lòng thay đổi mật khẩu sau khi đăng nhập lần đầu 
            </p>
          </div>

          {/* Back to User Site */}
          <div className="mt-6 text-center">
            <Link 
              href="/" 
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
            >
              <i className="ri-arrow-left-line mr-1"></i>
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
