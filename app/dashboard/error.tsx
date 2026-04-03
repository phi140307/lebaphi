'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-error-warning-line text-4xl text-red-600"></i>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Có lỗi xảy ra!</h1>
        
        <p className="text-gray-600 mb-8">
          Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
        </p>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            <i className="ri-refresh-line mr-2"></i>
            Thử lại
          </button>
          
          <Link
            href="/dashboard"
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center block whitespace-nowrap"
          >
            <i className="ri-home-line mr-2"></i>
            Về trang chủ
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
            <details>
              <summary className="cursor-pointer font-medium text-gray-900">Chi tiết lỗi (Dev mode)</summary>
              <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap break-words">
                {error.message}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}