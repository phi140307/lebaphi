
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
    <div className="min-h-screen relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.22),_transparent_30%),linear-gradient(135deg,_#020617,_#111827_45%,_#1e1b4b)]">
        <div className="auth-grid absolute inset-0 opacity-50"></div>
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
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 md:p-8">
        <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/60 backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative hidden min-h-[720px] overflow-hidden lg:block">
            <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(15,23,42,0.5),rgba(76,29,149,0.55),rgba(29,78,216,0.45))]"></div>
            <div className="absolute left-10 top-10 max-w-md text-white">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                <i className="ri-sparkling-2-line"></i>
                Nền tảng dịch vụ số hiện đại
              </div>
              <h1 className="mb-4 text-5xl font-black leading-tight">
                Tạo tài khoản để bắt đầu mua dịch vụ nhanh hơn.
              </h1>
              <p className="text-base text-white/80">
                Quản lý đơn hàng, theo dõi tiến độ, nạp tiền và sử dụng toàn bộ hệ sinh thái dịch vụ social, AI và premium trong một giao diện đồng bộ.
              </p>
            </div>
            <div className="absolute bottom-10 left-10 right-10 grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                  <p className="text-2xl font-bold">60+</p>
                  <p className="mt-1 text-sm text-white/75">Dịch vụ đang hoạt động</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="mt-1 text-sm text-white/75">Hỗ trợ liên tục</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur">
                  <p className="text-2xl font-bold">Nhanh</p>
                  <p className="mt-1 text-sm text-white/75">Xử lý đơn tức thì</p>
                </div>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-slate-950/35 p-5 text-white backdrop-blur">
                <div className="mb-3 flex items-center gap-3">
                  <img
                    src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/557260a0b6689a10feeaff4143aebb61.png"
                    alt="lebaphi.com"
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                  <div>
                    <p className="font-semibold">lebaphi.com</p>
                    <p className="text-sm text-white/70">Social growth, premium tools, AI services</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-white/75">
                  Đăng ký chỉ mất chưa tới 1 phút. Sau khi tạo tài khoản, bạn có thể đặt đơn, lưu lịch sử và theo dõi mọi dịch vụ trong dashboard cá nhân.
                </p>
              </div>
            </div>
          </div>

          <div className="relative p-5 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-3">
                  <img
                    src="https://static.readdy.ai/image/498805ced0a624268fdcefbf8368cbd9/557260a0b6689a10feeaff4143aebb61.png"
                    alt="lebaphi.com"
                    className="h-12 w-12 rounded-2xl object-cover shadow-lg"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">lebaphi.com</p>
                    <p className="text-xs text-slate-400">Create your account</p>
                  </div>
                </Link>
                <Link href="/login" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10">
                  Đăng nhập
                </Link>
              </div>

              <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-white">Tạo tài khoản mới</h1>
                <p className="text-sm leading-6 text-slate-400">
                  Điền thông tin để mở dashboard cá nhân, quản lý đơn hàng và bắt đầu sử dụng dịch vụ ngay.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-7">
              {/* Logo */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {message && (
                  <div
                    className={`rounded-2xl border p-4 text-sm ${
                      messageType === 'success'
                        ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100'
                        : 'border-rose-400/30 bg-rose-500/15 text-rose-100'
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
                  <label className="block text-sm font-medium text-slate-200">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition focus-within:border-violet-400/50 focus-within:bg-white/10">
                      <div className="flex items-center">
                        <div className="border-r border-white/10 px-4 py-3 bg-white/5">
                          <i className="ri-user-line text-slate-400"></i>
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Nhập họ và tên..."
                          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Username Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition focus-within:border-violet-400/50 focus-within:bg-white/10">
                      <div className="flex items-center">
                        <div className="border-r border-white/10 px-4 py-3 bg-white/5">
                          <i className="ri-at-line text-slate-400"></i>
                        </div>
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Nhập tên đăng nhập..."
                          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Email
                  </label>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition focus-within:border-violet-400/50 focus-within:bg-white/10">
                      <div className="flex items-center">
                        <div className="border-r border-white/10 px-4 py-3 bg-white/5">
                          <i className="ri-mail-line text-slate-400"></i>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Nhập email..."
                          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition focus-within:border-violet-400/50 focus-within:bg-white/10">
                      <div className="flex items-center">
                        <div className="border-r border-white/10 px-4 py-3 bg-white/5">
                          <i className="ri-lock-line text-slate-400"></i>
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition focus-within:border-violet-400/50 focus-within:bg-white/10">
                      <div className="flex items-center">
                        <div className="border-r border-white/10 px-4 py-3 bg-white/5">
                          <i className="ri-lock-2-line text-slate-400"></i>
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 outline-none"
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
                  className="group mt-2 w-full"
                >
                  <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 px-6 py-4 font-bold text-white shadow-lg shadow-violet-900/30 transition-all duration-300 group-hover:translate-y-[-2px] group-hover:shadow-2xl group-hover:shadow-fuchsia-900/30 disabled:cursor-not-allowed disabled:opacity-50">
                    <span className="button-shine absolute inset-0 opacity-40"></span>
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
                  <p className="text-sm text-slate-400">
                    Đã có tài khoản?{' '}
                    <Link
                      href="/login"
                      className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text font-medium text-transparent transition-all duration-200 hover:from-violet-300 hover:to-cyan-300"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </form>
            </div>
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  ← Trở về trang chủ
                </Link>
              </div>
            </div>
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

          .auth-grid {
            background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
            background-size: 40px 40px;
            mask-image: radial-gradient(circle at center, black 35%, transparent 85%);
          }

          .button-shine {
            background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.45) 45%, transparent 70%);
            transform: translateX(-120%);
            animation: shine 3.6s ease-in-out infinite;
          }

          @keyframes shine {
            0% {
              transform: translateX(-120%);
            }
            45%,
            100% {
              transform: translateX(120%);
            }
          }
        `}
      </style>
    </div>
  );
}
