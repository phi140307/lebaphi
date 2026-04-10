
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../lib/supabase';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      setMessage('Vui lòng điền đầy đủ thông tin');
      setMessageType('error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      setMessageType('error');
      return;
    }

    if (formData.password.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      console.log('Starting registration...');
      const result = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName
      });

      console.log('Registration result:', result);

      if (result.error) {
        const err = result.error
        const errorMsg = err.message || err.name || 'Unknown error'
        console.log('Full error:', err)
        setMessage('Lỗi: ' + errorMsg)
        setMessageType('error')
        setIsLoading(false)
        return
      }

      setMessage('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.')
      setMessageType('success')
      
      setTimeout(() => {
        router.push('/login')
        setIsLoading(false)
      }, 3000)

    } catch (err: any) {
      console.error('Register catch error:', err);
      setMessage('Lỗi: ' + (err.message || 'Unknown error'));
      setMessageType('error');
      setIsLoading(false);
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
          {/* Game Style Register Panel */}
          <div className="relative">
            {/* Decorative border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl blur-sm opacity-75"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-md opacity-50 animate-pulse"></div>

            {/* Main register panel */}
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
                  Tạo tài khoản mới
                </h1>
                <p className="text-white/80 text-sm">
                  Đăng ký để bắt đầu sử dụng dịch vụ của chúng tôi
                </p>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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

                {/* Full Name Input */}
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium">
                    Họ và tên
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
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Nhập họ và tên..."
                          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                      <div className="flex items-center">
                        <div className="px-4 py-3 bg-white/5 border-r border-white/10">
                          <i className="ri-at-line text-white/70"></i>
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Nhập tên đăng nhập..."
                          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                      <div className="flex items-center">
                        <div className="px-4 py-3 bg-white/5 border-r border-white/10">
                          <i className="ri-mail-line text-white/70"></i>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Nhập email..."
                          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none"
                          required
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
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="block text-white/90 text-sm font-medium">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-sm"></div>
                    <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
                      <div className="flex items-center">
                        <div className="px-4 py-3 bg-white/5 border-r border-white/10">
                          <i className="ri-lock-2-line text-white/70"></i>
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/50 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group mt-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Đang đăng ký...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <i className="ri-user-add-line mr-2"></i>
                        ĐĂNG KÝ
                      </div>
                    )}
                  </div>
                </button>

                {/* Login Link */}
                <div className="text-center pt-4">
                  <p className="text-white/70 text-sm">
                    Đã có tài khoản?{' '}
                    <Link
                      href="/login"
                      className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 font-medium transition-all duration-200"
                    >
                      Đăng nhập ngay
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
