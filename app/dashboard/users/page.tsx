'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UsersManagement() {
  const router = useRouter();

  useEffect(() => {
    // Chuyển hướng đến trang admin vì chỉ admin mới có quyền quản lý người dùng
    router.push('/admin/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-lock-line text-3xl text-red-600"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Truy cập bị từ chối</h2>
        <p className="text-gray-600 mb-6">Chỉ có admin mới có quyền quản lý người dùng</p>
        
        <div className="space-y-3">
          <Link 
            href="/admin/login"
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <i className="ri-admin-line mr-2"></i>
            Đăng nhập Admin
          </Link>
          
          <Link 
            href="/dashboard"
            className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}