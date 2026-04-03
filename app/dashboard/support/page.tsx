'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: ''
  });
  const [tickets, setTickets] = useState([
    {
      id: 'TK001',
      subject: 'Đơn hàng chưa được xử lý',
      category: 'order',
      priority: 'high',
      status: 'open',
      createdAt: '2024-01-15',
      lastReply: '2024-01-15',
      messages: [
        {
          id: 1,
          sender: 'user',
          message: 'Đơn hàng #ORD123 của tôi đã thanh toán nhưng chưa được xử lý sau 2 giờ.',
          timestamp: '2024-01-15 10:30'
        }
      ]
    }
  ]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Load user session
    const userSession = localStorage.getItem('user_session');
    if (userSession) {
      setCurrentUser(JSON.parse(userSession));
    }

    // Load tickets from localStorage
    const savedTickets = localStorage.getItem('support_tickets');
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets));
      } catch (error) {
        console.error('Error loading tickets:', error);
      }
    }
  }, []);

  const faqData = [
    {
      category: 'general',
      title: 'Câu hỏi chung',
      items: [
        {
          question: 'Làm thế nào để nạp tiền vào tài khoản?',
          answer: 'Bạn có thể nạp tiền qua chuyển khoản ngân hàng hoặc ví điện tử. Vào mục "Nạp tiền" trong dashboard và làm theo hướng dẫn.'
        },
        {
          question: 'Thời gian xử lý đơn hàng là bao lâu?',
          answer: 'Thời gian xử lý tùy thuộc vào từng dịch vụ, thường từ vài phút đến 24 giờ. Chi tiết được ghi rõ trong mô tả sản phẩm.'
        },
        {
          question: 'Tôi có thể hủy đơn hàng không?',
          answer: 'Đơn hàng chỉ có thể hủy khi còn ở trạng thái "Pending". Sau khi bắt đầu xử lý, bạn không thể hủy được.'
        }
      ]
    },
    {
      category: 'payment',
      title: 'Thanh toán',
      items: [
        {
          question: 'Những phương thức thanh toán nào được hỗ trợ?',
          answer: 'Hiện tại chúng tôi hỗ trợ chuyển khoản ngân hàng, Momo, ZaloPay và các ví điện tử phổ biến.'
        },
        {
          question: 'Có phí khi nạp tiền không?',
          answer: 'Chúng tôi không tính phí nạp tiền. Tuy nhiên, ngân hàng có thể tính phí giao dịch theo quy định của họ.'
        },
        {
          question: 'Tại sao giao dịch của tôi bị từ chối?',
          answer: 'Giao dịch có thể bị từ chối do thiếu số dư, thông tin sai, hoặc vấn đề từ phía ngân hàng. Vui lòng liên hệ hỗ trợ.'
        }
      ]
    },
    {
      category: 'order',
      title: 'Đơn hàng',
      items: [
        {
          question: 'Tại sao đơn hàng của tôi bị trì hoãn?',
          answer: 'Đơn hàng có thể bị trì hoãn do quá tải hệ thống, vấn đề kỹ thuật, hoặc link không hợp lệ. Hãy kiểm tra trạng thái trong mục "Đơn hàng".'
        },
        {
          question: 'Làm thế nào để theo dõi tiến độ đơn hàng?',
          answer: 'Vào mục "Đơn hàng" trong dashboard để xem chi tiết tiến độ và trạng thái của tất cả đơn hàng.'
        },
        {
          question: 'Tôi có được hoàn tiền nếu đơn hàng thất bại?',
          answer: 'Có, nếu đơn hàng thất bại do lỗi từ hệ thống, chúng tôi sẽ hoàn tiền vào tài khoản của bạn.'
        }
      ]
    },
    {
      category: 'account',
      title: 'Tài khoản',
      items: [
        {
          question: 'Làm thế nào để thay đổi mật khẩu?',
          answer: 'Vào "Cài đặt tài khoản" trong dashboard, chọn "Đổi mật khẩu" và làm theo hướng dẫn.'
        },
        {
          question: 'Tài khoản của tôi bị khóa, phải làm sao?',
          answer: 'Liên hệ ngay với bộ phận hỗ trợ qua Zalo 0369842545 để được hỗ trợ mở khóa tài khoản.'
        },
        {
          question: 'Có thể thay đổi thông tin cá nhân không?',
          answer: 'Có, bạn có thể cập nhật hầu hết thông tin cá nhân trong mục "Hồ sơ". Một số thông tin quan trọng cần liên hệ hỗ trợ.'
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'ri-question-line' },
    { id: 'general', name: 'Chung', icon: 'ri-information-line' },
    { id: 'payment', name: 'Thanh toán', icon: 'ri-money-dollar-circle-line' },
    { id: 'order', name: 'Đơn hàng', icon: 'ri-shopping-cart-line' },
    { id: 'account', name: 'Tài khoản', icon: 'ri-user-line' }
  ];

  const filteredFAQ = faqData.filter(category => {
    if (selectedCategory === 'all') return true;
    return category.category === selectedCategory;
  }).map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const submitTicket = () => {
    if (!ticketForm.subject.trim() || !ticketForm.message.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newTicket = {
      id: `TK${String(tickets.length + 1).padStart(3, '0')}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'open',
      createdAt: new Date().toISOString().split('T')[0],
      lastReply: new Date().toISOString().split('T')[0],
      messages: [
        {
          id: 1,
          sender: 'user',
          message: ticketForm.message,
          timestamp: new Date().toLocaleString('vi-VN')
        }
      ]
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('support_tickets', JSON.stringify(updatedTickets));

    setTicketForm({
      subject: '',
      category: 'general', 
      priority: 'medium',
      message: ''
    });

    alert('Ticket đã được gửi thành công! Chúng tôi sẽ phản hồi trong thời gian sớm nhất cho quý khách ạ.');
    setActiveTab('tickets');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">Trung Tâm Hỗ Trợ</h1>
              <p className="text-sm text-gray-600">Câu hỏi thường gặp và hỗ trợ kỹ thuật</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Contact Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <i className="ri-customer-service-2-line text-xl"></i>
                <span className="font-medium">Cần hỗ trợ ngay?</span>
              </div>
              <div className="text-sm opacity-90">
                Liên hệ trực tiếp qua Zalo để được hỗ trợ sớm nhất
              </div>
            </div>
            <a
              href="https://zalo.me/0369842545"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 whitespace-nowrap"
            >
              <i className="ri-chat-3-line"></i>
              <span>Chat Zalo: 0369842545</span>
            </a>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm border mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'faq', name: 'Câu hỏi thường gặp', icon: 'ri-question-answer-line' },
                  { id: 'tickets', name: 'Ticket hỗ trợ', icon: 'ri-customer-service-line' },
                  { id: 'contact', name: 'Liên hệ', icon: 'ri-contacts-line' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <i className={`${tab.icon} mr-2`}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="space-y-6">
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Tìm kiếm câu hỏi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <i className={`${category.icon} text-sm`}></i>
                          <span className="text-sm">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* FAQ List */}
                  <div className="space-y-6">
                    {filteredFAQ.map((category) => (
                      <div key={category.category}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <i className="ri-folder-open-line mr-2 text-blue-600"></i>
                          {category.title}
                        </h3>
                        <div className="space-y-3">
                          {category.items.map((item, index) => (
                            <details key={index} className="bg-gray-50 rounded-lg border">
                              <summary className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors">
                                <div className="flex items-center">
                                  <i className="ri-question-line text-blue-600 mr-3"></i>
                                  <span className="font-medium text-gray-900">{item.question}</span>
                                </div>
                              </summary>
                              <div className="px-4 pb-3 pt-1">
                                <div className="pl-8 text-gray-600 leading-relaxed">
                                  {item.answer}
                                </div>
                              </div>
                            </details>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredFAQ.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="ri-search-line text-3xl text-gray-400"></i>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy câu hỏi</h3>
                      <p className="text-gray-500 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
                      <button
                        onClick={() => setActiveTab('tickets')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                      >
                        Gửi câu hỏi mới
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tickets Tab */}
              {activeTab === 'tickets' && (
                <div className="space-y-6">
                  {/* Create New Ticket */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Tạo Ticket Hỗ Trợ Mới</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiêu đề
                        </label>
                        <input
                          type="text"
                          value={ticketForm.subject}
                          onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Mô tả ngắn gọn vấn đề..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Danh mục
                        </label>
                        <select
                          value={ticketForm.category}
                          onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none pr-8"
                        >
                          <option value="general">Chung</option>
                          <option value="payment">Thanh toán</option>
                          <option value="order">Đơn hàng</option>
                          <option value="account">Tài khoản</option>
                          <option value="technical">Kỹ thuật</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Độ ưu tiên
                      </label>
                      <div className="flex space-x-4">
                        {[
                          { value: 'low', label: 'Thấp', color: 'text-green-600' },
                          { value: 'medium', label: 'Trung bình', color: 'text-yellow-600' },
                          { value: 'high', label: 'Cao', color: 'text-red-600' }
                        ].map((priority) => (
                          <label key={priority.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="priority"
                              value={priority.value}
                              checked={ticketForm.priority === priority.value}
                              onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                              className="text-blue-600"
                            />
                            <span className={`text-sm font-medium ${priority.color}`}>{priority.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mô tả chi tiết
                      </label>
                      <textarea
                        value={ticketForm.message}
                        onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <button
                      onClick={submitTicket}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      <i className="ri-send-plane-line mr-2"></i>
                      Gửi ticket
                    </button>
                  </div>

                  {/* Tickets List */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Của Bạn</h3>
                    {tickets.length > 0 ? (
                      <div className="space-y-4">
                        {tickets.map((ticket) => (
                          <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="font-medium text-gray-900">#{ticket.id}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                    {ticket.status === 'open' ? 'Đang mở' : ticket.status === 'pending' ? 'Chờ xử lý' : 'Đã đóng'}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority === 'high' ? 'Cao' : ticket.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                  </span>
                                </div>
                                <h4 className="font-medium text-gray-900 mb-1">{ticket.subject}</h4>
                                <div className="text-sm text-gray-500">
                                  Tạo: {new Date(ticket.createdAt).toLocaleDateString('vi-VN')} • 
                                  Cập nhật: {new Date(ticket.lastReply).toLocaleDateString('vi-VN')}
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-gray-600">
                                <i className="ri-more-line text-xl"></i>
                              </button>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-600">
                                Tin nhắn mới nhất: {ticket.messages[ticket.messages.length - 1]?.message.substring(0, 100)}...
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <i className="ri-ticket-line text-2xl text-gray-400"></i>
                        </div>
                        <p className="text-gray-500">Bạn chưa có ticket nào</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Methods */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Thông Tin Liên Hệ</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="ri-chat-3-line text-green-600 text-xl"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Zalo (Khuyến nghị)</h4>
                            <p className="text-sm text-gray-600">Phản hồi nhanh trong 5-10 phút</p>
                            <a
                              href="https://zalo.me/0369842545"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 font-medium text-sm"
                            >
                              0369842545
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="ri-mail-line text-blue-600 text-xl"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Email</h4>
                            <p className="text-sm text-gray-600">Phản hồi trong 2-6 giờ</p>
                            <a
                              href="mailto:phile140307@gmail.com"
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              phile140307@gmail.com
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <i className="ri-customer-service-2-line text-purple-600 text-xl"></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">Ticket System</h4>
                            <p className="text-sm text-gray-600">Phản hồi trong 12-24 giờ</p>
                            <button
                              onClick={() => setActiveTab('tickets')}
                              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                            >
                              Tạo ticket mới
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Business Hours & Info */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900">Thời Gian Hỗ Trợ</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thứ 2 - Thứ 6:</span>
                            <span className="font-medium">8:00 - 22:00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Thứ 7 - Chủ nhật:</span>
                            <span className="font-medium">9:00 - 20:00</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hỗ trợ khẩn cấp:</span>
                            <span className="font-medium text-green-600">24/7</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <i className="ri-lightbulb-line text-yellow-600 mr-3 mt-0.5"></i>
                          <div>
                            <h4 className="font-medium text-yellow-900 mb-1">Mẹo để được hỗ trợ nhanh hơn:</h4>
                            <ul className="text-sm text-yellow-800 space-y-1">
                              <li>• Mô tả chi tiết vấn đề mà bạn đang gặp phải</li>
                              <li>• Cung cấp ID đơn hàng (nếu có)</li>
                              <li>• Đính kèm ảnh chụp màn hình</li>
                              <li>• Sử dụng Zalo để được hỗ trợ nhanh nhất</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                          <i className="ri-information-line text-blue-600 mr-3 mt-0.5"></i>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">Thông tin doanh nghiệp:</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                              <p><strong>Chủ sở hữu:</strong> Lê Bá Phi</p>
                              <p><strong>Website:</strong> lebaphi.com</p>
                              <p><strong>Chuyên môn:</strong> Dịch vụ SMM Panel</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}