
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../../lib/supabase';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  // Load saved credentials when component mounts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCredentials = localStorage.getItem('savedCredentials');
    if (savedCredentials) {
      try {
        const { username: savedUsername, password: savedPassword } = JSON.parse(
          savedCredentials
        );
        setUsername(savedUsername || '');
        setPassword(savedPassword || '');
        setRememberMe(true);
      } catch (error) {
        localStorage.removeItem('savedCredentials');
      }
    }
  }, []);

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
      const { data, error } = await loginUser(username, password);

      if (error || !data) {
        setMessage('Tên đăng nhập hoặc mật khẩu không chính xác');
        setMessageType('error');
        setIsLoading(false);
        return;
      }

      // Lưu thông tin user vào localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'user_session',
          JSON.stringify({
            id: data.id,
            username: data.username,
            email: data.email,
            full_name: data.full_name,
            balance: data.balance || 0,
            loginTime: Date.now(),
          })
        );

        localStorage.setItem('just_logged_in', 'true');

        // Save credentials if remember me is checked
        if (rememberMe) {
          localStorage.setItem(
            'savedCredentials',
            JSON.stringify({
              username,
              password,
            })
          );
        } else {
          localStorage.removeItem('savedCredentials');
        }
      }

      setMessage('Đăng nhập thành công! Đang chuyển hướng...');
      setMessageType('success');

      setTimeout(() => {
        router.push('/dashboard');
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setMessage('Có lỗi xảy ra khi đăng nhập');
      setMessageType('error');
      setIsLoading(false);
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);

    if (!checked && typeof window !== 'undefined') {
      localStorage.removeItem('savedCredentials');
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-60 right-32 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur-lg animate-float"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-2xl animate-float"
            style={{ animationDelay: '2s' }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-28 h-28 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-lg blur-lg animate-float"
            style={{ animationDelay: '0.5s' }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Game Style Login Panel */}
          <div className="relative">
            {/* Decorative border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-sm opacity-75"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-md opacity-50 animate-pulse"></div>

            {/* Main login panel */}
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8">
              {/* Logo */}
              <div className="text-center mb-8">
                <Link href="/" className="inline-block">
                  <img
                    src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/557260a0b6689a10feeaff4143aebb61.png"
                    alt="lebaphi.com"
                    className="w-24 h-24 mx-auto rounded-xl object-cover hover:scale-105 transition-transform duration-300 shadow-lg"
                  />
                </Link>
              </div>

              {/* Welcome Text */}
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  Chào mừng đến với shop của Lê Bá Phi
                </h1>
                <p className="text-white/80 text-sm">
                  Đăng nhập để tiếp tục hành trình của bạn
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                {message && (
                  <div
                    className={`p-4 rounded-xl text-sm backdrop-blur-sm border ${
                      messageType === 'success'
                        ? 'bg-green-500/20 text-green-100 border-green-400/30'
                        : 'bg-red-500/20 text-red-100 border-red-400/30'
                    }`}
                  >
                    <div className="flex items-center">
                      <i
                        className={`${
                          messageType === 'success' ? 'ri-check-line' : 'ri-error-warning-line'
                        } mr-2`}
                      ></i>
                      {message}
                    </div>
                  </div>
                )}

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium">
                    Tài khoản
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                      <div className="flex items-center">
                        <div className="px-4 py-3 bg-white/5 border-r border-white/10">
                          <i className="ri-user-line text-white/70"></i>
                        </div>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Nhập tài khoản..."
                          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none"
                          required
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                      <div className="flex items-center">
                        <div className="px-4 py-3 bg-white/5 border-r border-white/10">
                          <i className="ri-lock-line text-white/70"></i>
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => handleRememberMeChange(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                          rememberMe
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                            : 'bg-white/10 border-white/30 group-hover:border-white/50'
                        }`}
                      >
                        {rememberMe && (
                          <i className="ri-check-line text-white text-xs absolute inset-0 flex items-center justify-center"></i>
                        )}
                      </div>
                    </div>
                    <span className="text-white/80 text-sm select-none">
                      Nhớ mật khẩu
                    </span>
                  </label>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Đang đăng nhập...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <i className="ri-login-circle-line mr-2"></i>
                        ĐĂNG NHẬP
                      </div>
                    )}
                  </div>
                </button>

                {/* Register Link */}
                <div className="text-center pt-4">
                  <p className="text-white/70 text-sm">
                    Chưa có tài khoản?{' '}
                    <Link
                      href="/register"
                      className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 font-medium transition-all duration-200"
                    >
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              ← Trở về trang chủ
            </Link>
          </div>
        </div>
      </div>

      {/* Additional CSS for animations */}
      <style jsx>
        {`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px) rotate(0deg);
            }
            33% {
              transform: translateY(-10px) rotate(1deg);
            }
            66% {
              transform: translateY(5px) rotate(-1deg);
            }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}