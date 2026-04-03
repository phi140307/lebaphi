'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ApiDocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user session
    const userSession = localStorage.getItem('user_session');
    if (userSession) {
      const userData = JSON.parse(userSession);
      setCurrentUser(userData);
      
      // Generate or load API key
      let userApiKey = localStorage.getItem(`api_key_${userData.id}`);
      if (!userApiKey) {
        userApiKey = generateApiKey();
        localStorage.setItem(`api_key_${userData.id}`, userApiKey);
      }
      setApiKey(userApiKey);
    }
    setLoading(false);
  }, []);

  const generateApiKey = () => {
    return 'lbp_' + Math.random().toString(36).substr(2, 9) + Math.random().toString(36).substr(2, 9);
  };

  const regenerateApiKey = () => {
    if (confirm('Bạn có chắc muốn tạo lại API key? Key cũ sẽ không thể sử dụng nữa.')) {
      const newApiKey = generateApiKey();
      setApiKey(newApiKey);
      if (currentUser) {
        localStorage.setItem(`api_key_${currentUser.id}`, newApiKey);
      }
      alert('API key mới đã được tạo thành công!');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép vào clipboard!');
  };

  const sections = [
    { id: 'overview', name: 'Tổng quan', icon: 'ri-eye-line' },
    { id: 'authentication', name: 'Xác thực', icon: 'ri-key-2-line' },
    { id: 'endpoints', name: 'API Endpoints', icon: 'ri-code-line' },
    { id: 'examples', name: 'Ví dụ', icon: 'ri-file-code-line' },
    { id: 'errors', name: 'Mã lỗi', icon: 'ri-error-warning-line' }
  ];

  const endpoints = [
    {
      method: 'GET',
      path: '/api/services',
      description: 'Lấy danh sách tất cả dịch vụ',
      params: []
    },
    {
      method: 'GET',
      path: '/api/services/{category}',
      description: 'Lấy danh sách dịch vụ theo danh mục',
      params: [
        { name: 'category', type: 'string', description: 'Danh mục dịch vụ (facebook, instagram, tiktok...)' }
      ]
    },
    {
      method: 'POST',
      path: '/api/orders',
      description: 'Tạo đơn hàng mới',
      params: [
        { name: 'service_id', type: 'integer', description: 'ID của dịch vụ' },
        { name: 'link', type: 'string', description: 'Link cần tăng tương tác' },
        { name: 'quantity', type: 'integer', description: 'Số lượng cần tăng' }
      ]
    },
    {
      method: 'GET',
      path: '/api/orders',
      description: 'Lấy danh sách đơn hàng',
      params: []
    },
    {
      method: 'GET',
      path: '/api/orders/{order_id}',
      description: 'Lấy thông tin chi tiết đơn hàng',
      params: [
        { name: 'order_id', type: 'string', description: 'ID của đơn hàng' }
      ]
    },
    {
      method: 'GET',
      path: '/api/balance',
      description: 'Kiểm tra số dư tài khoản',
      params: []
    }
  ];

  if (loading) {
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
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              <i className="ri-arrow-left-line text-xl"></i>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tài Liệu API</h1>
              <p className="text-sm text-gray-600">Hướng dẫn tích hợp API cho developers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-screen border-r">
          <div className="p-4">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeSection === section.id 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <i className={`${section.icon} text-lg`}></i>
                  <span className="text-sm font-medium">{section.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Tổng Quan API</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">
                      API của Lê Bá Phi cho phép bạn tích hợp các dịch vụ SMM Panel vào ứng dụng hoặc website của mình.
                      Bạn có thể tự động hóa việc đặt hàng, kiểm tra trạng thái đơn hàng và quản lý đơn hàng.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tính năng chính:</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li>Lấy danh sách dịch vụ theo danh mục</li>
                      <li>Tạo và quản lý đơn hàng tự động</li>
                      <li>Kiểm tra trạng thái đơn hàng  real-time</li>
                      <li>Quản lý số dư tài khoản</li>
                      <li>Webhook để nhận thông báo</li>
                    </ul>

                    <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Base URL:</h3>
                    <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                      https://lebaphi.com/api/v1
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Authentication Section */}
            {activeSection === 'authentication' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Xác Thực</h2>
                  
                  {/* API Key Management */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">API Key của bạn</h3>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-white border border-blue-300 rounded-lg px-3 py-2 font-mono text-sm">
                        {showApiKey ? apiKey : '•'.repeat(apiKey.length)}
                      </div>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        <i className={`ri-${showApiKey ? 'eye-off' : 'eye'}-line mr-1`}></i>
                        {showApiKey ? 'Ẩn' : 'Hiện'}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-file-copy-line mr-1"></i>
                        Sao chép
                      </button>
                      <button
                        onClick={regenerateApiKey}
                        className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
                      >
                        <i className="ri-refresh-line mr-1"></i>
                        Tạo mới
                      </button>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">
                      Tất cả các yêu cầu API phải bao gồm API key trong header để xác thực:
                    </p>
                    
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
                      <div className="text-gray-400">// Header</div>
                      <div>Authorization: Bearer {apiKey}</div>
                      <div>Content-Type: application/json</div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start">
                        <i className="ri-warning-line text-yellow-600 mr-2 mt-0.5"></i>
                        <div>
                          <p className="text-yellow-800 text-sm font-medium">Lưu ý bảo mật:</p>
                          <p className="text-yellow-700 text-sm mt-1">
                            Không chia sẻ API key với ai khác. Nếu key bị lộ, hãy tạo lại ngay lập tức.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Endpoints Section */}
            {activeSection === 'endpoints' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">API Endpoints</h2>
                  
                  <div className="space-y-6">
                    {endpoints.map((endpoint, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                            endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                            endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {endpoint.method}
                          </span>
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {endpoint.path}
                          </code>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{endpoint.description}</p>
                        
                        {endpoint.params.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Tham số:</h4>
                            <div className="space-y-2">
                              {endpoint.params.map((param, paramIndex) => (
                                <div key={paramIndex} className="flex items-start space-x-3 text-sm">
                                  <code className="bg-gray-100 px-2 py-1 rounded font-mono">
                                    {param.name}
                                  </code>
                                  <span className="text-gray-500">({param.type})</span>
                                  <span className="text-gray-600">{param.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Examples Section */}
            {activeSection === 'examples' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Ví Dụ Sử Dụng</h2>
                  
                  <div className="space-y-6">
                    {/* Get Services Example */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Lấy danh sách dịch vụ</h3>
                      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-gray-400">// JavaScript</div>
                        <div className="mt-2">
                          {`const response = await fetch('https://lebaphi.com/api/v1/services', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);`}
                        </div>
                      </div>
                    </div>

                    {/* Create Order Example */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Tạo đơn hàng mới</h3>
                      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-gray-400">// JavaScript</div>
                        <div className="mt-2">
                          {`const orderData = {
  service_id: 1,
  link: 'https://tiktok.com/@username/video/123456789',
  quantity: 1000
};

const response = await fetch('https://lebaphi.com/api/v1/orders', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(orderData)
});

const result = await response.json();
console.log(result);`}
                        </div>
                      </div>
                    </div>

                    {/* Check Order Status Example */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Kiểm tra trạng thái đơn hàng</h3>
                      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-gray-400">// JavaScript</div>
                        <div className="mt-2">
                          {`const orderId = 'order_123456789';

const response = await fetch(\`https://lebaphi.com/api/v1/orders/\${orderId}\`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  }
});

const orderData = await response.json();
console.log('Order Status:', orderData.status);`}
                        </div>
                      </div>
                    </div>

                    {/* Python Example */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Ví dụ với Python</h3>
                      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                        <div className="text-gray-400"># Python</div>
                        <div className="mt-2">
                          {`import requests

headers = {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
}

# Lấy danh sách dịch vụ
response = requests.get('https://lebaphi.com/api/v1/services', headers=headers)
services = response.json()

# Tạo đơn hàng
order_data = {
    'service_id': 1,
    'link': 'https://tiktok.com/@username/video/123456789',
    'quantity': 1000
}

response = requests.post('https://lebaphi.com/api/v1/orders', 
                        headers=headers, 
                        json=order_data)
result = response.json()
print(f"Order ID: {result['order_id']}")`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Errors Section */}
            {activeSection === 'errors' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mã Lỗi</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold">200</span>
                        <span className="font-semibold">OK</span>
                      </div>
                      <p className="text-gray-600 text-sm">Yêu cầu thành công</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">400</span>
                        <span className="font-semibold">Bad Request</span>
                      </div>
                      <p className="text-gray-600 text-sm">Dữ liệu yêu cầu không hợp lệ</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">401</span>
                        <span className="font-semibold">Unauthorized</span>
                      </div>
                      <p className="text-gray-600 text-sm">API key không hợp lệ hoặc không được cung cấp</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">403</span>
                        <span className="font-semibold">Forbidden</span>
                      </div>
                      <p className="text-gray-600 text-sm">Không có quyền truy cập resource này</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">404</span>
                        <span className="font-semibold">Not Found</span>
                      </div>
                      <p className="text-gray-600 text-sm">Resource không tồn tại</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">429</span>
                        <span className="font-semibold">Too Many Requests</span>
                      </div>
                      <p className="text-gray-600 text-sm">Quá nhiều yêu cầu trong thời gian ngắn </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-bold">500</span>
                        <span className="font-semibold">Internal Server Error</span>
                      </div>
                      <p className="text-gray-600 text-sm">Lỗi server nội bộ</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Định dạng phản hồi lỗi:</h3>
                    <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
                      {`{
  "error": true,
  "message": "Mô tả lỗi",
  "code": 400,
  "details": {
    "field": "Lỗi cụ thể của field"
  }
}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}