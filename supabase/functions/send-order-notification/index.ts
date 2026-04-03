import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  }

  try {
    const { 
      orderId, 
      customerName, 
      customerEmail, 
      totalAmount, 
      paymentMethod, 
      items 
    } = await req.json()

    // Tạo nội dung email HTML đẹp mắt
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white; border-radius: 12px 12px 0 0;">
          <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">ĐƠN HÀNG MỚI!</h1>
          <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.95;">Có khách hàng vừa đặt hàng thành công</p>
          <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; margin-top: 20px;">
            <div style="font-size: 24px; font-weight: bold; color: #fff200;">💰 ${totalAmount?.toLocaleString?.() || totalAmount}đ</div>
            <div style="font-size: 14px; margin-top: 5px; opacity: 0.9;">Tổng giá trị đơn hàng</div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 40px 30px;">
          <!-- Order Info -->
          <div style="background: #e3f2fd; padding: 25px; border-radius: 12px; margin-bottom: 30px; border-left: 4px solid #1976d2;">
            <h2 style="color: #1565c0; margin: 0 0 20px 0; font-size: 20px;">📋 Thông tin đơn hàng</h2>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #bbdefb;">
                <span style="font-weight: 600; color: #424242;">🆔 Mã đơn hàng:</span>
                <span style="color: #1976d2; font-weight: bold; font-family: monospace;">#${orderId?.slice(-8) || 'unknown'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #bbdefb;">
                <span style="font-weight: 600; color: #424242;">👤 Khách hàng:</span>
                <span style="color: #424242;">${customerName}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #bbdefb;">
                <span style="font-weight: 600; color: #424242;">📧 Email:</span>
                <span style="color: #424242;">${customerEmail}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #bbdefb;">
                <span style="font-weight: 600; color: #424242;">💳 Thanh toán:</span>
                <span style="color: #424242;">${paymentMethod === 'balance' ? '💰 Số dư tài khoản' : '💳 Thẻ tín dụng'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0;">
                <span style="font-weight: 600; color: #424242;">⏰ Thời gian:</span>
                <span style="color: #424242;">${new Date().toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <!-- Products -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #424242; margin: 0 0 20px 0; font-size: 18px; display: flex; align-items: center;">
              <span style="margin-right: 10px;">🛍️</span>
              Danh sách sản phẩm (${items?.length || 0} sản phẩm)
            </h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; border: 1px solid #e9ecef;">
              ${items?.map((item: any, index: number) => `
                <div style="background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; border: 1px solid #dee2e6; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <div style="flex: 1;">
                      <h4 style="margin: 0 0 8px 0; color: #212529; font-size: 16px; font-weight: 600;">${item.name}</h4>
                      <div style="color: #6c757d; font-size: 14px; margin-bottom: 6px;">
                        <span style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-weight: 500;">
                          📱 ${item.category?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div style="text-align: right; min-width: 120px;">
                      <div style="font-size: 18px; font-weight: bold; color: #28a745;">${(item.price * item.quantity)?.toLocaleString?.() || 'N/A'}đ</div>
                      <div style="font-size: 12px; color: #6c757d;">${item.quantity?.toLocaleString?.()} x ${item.price?.toLocaleString?.()}đ</div>
                    </div>
                  </div>
                  
                  ${item.targetUrl ? `
                    <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin-bottom: 8px;">
                      <div style="font-size: 13px; color: #495057; margin-bottom: 4px; font-weight: 500;">🔗 URL/Link:</div>
                      <div style="font-size: 14px; color: #007bff; word-break: break-all; font-family: monospace;">${item.targetUrl}</div>
                    </div>
                  ` : ''}
                  
                  ${item.notes ? `
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 12px; border-radius: 6px;">
                      <div style="font-size: 13px; color: #856404; margin-bottom: 4px; font-weight: 500;">📝 Ghi chú:</div>
                      <div style="font-size: 14px; color: #856404;">${item.notes}</div>
                    </div>
                  ` : ''}
                </div>
              `).join('') || '<div style="text-align: center; color: #6c757d; padding: 20px;">Không có sản phẩm nào</div>'}
            </div>
          </div>

          <!-- Action Required -->
          <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); border: 2px solid #e17055; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
            <h3 style="margin: 0 0 15px 0; color: #2d3436; display: flex; align-items: center;">
              <span style="font-size: 24px; margin-right: 10px;">⚡</span>
              CẦN XỬ LÝ NGAY
            </h3>
            <div style="color: #2d3436; line-height: 1.6;">
              <p style="margin: 0 0 10px 0; font-weight: 600;">📌 Các bước cần thực hiện:</p>
              <div style="background: rgba(255,255,255,0.7); padding: 15px; border-radius: 8px;">
                <p style="margin: 0 0 8px 0;">✅ 1. Kiểm tra thông tin đơn hàng và URL khách cung cấp</p>
                <p style="margin: 0 0 8px 0;">✅ 2. Bắt đầu xử lý các dịch vụ theo yêu cầu</p>
                <p style="margin: 0 0 8px 0;">✅ 3. Cập nhật trạng thái đơn hàng khi hoàn thành</p>
                <p style="margin: 0;">✅ 4. Thông báo cho khách hàng khi xong</p>
              </div>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="background: #e8f5e8; padding: 20px; border-radius: 12px; border-left: 4px solid #4caf50;">
            <h4 style="margin: 0 0 12px 0; color: #2e7d32; display: flex; align-items: center;">
              <span style="margin-right: 8px;">👤</span>
              Thông tin liên hệ khách hàng
            </h4>
            <p style="margin: 0 0 6px 0; color: #388e3c;">📧 Email: <strong>${customerEmail}</strong></p>
            <p style="margin: 0; color: #388e3c;">💬 Username: <strong>${customerName}</strong></p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #263238; color: white; padding: 25px 30px; text-align: center; border-radius: 0 0 12px 12px;">
          <div style="margin-bottom: 15px;">
            <span style="font-size: 24px;">🚀</span>
          </div>
          <p style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Hệ thống SMM Panel</p>
          <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.8;">Thông báo tự động từ hệ thống quản lý đơn hàng</p>
          <div style="background: rgba(255,255,255,0.1); padding: 12px; border-radius: 6px;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">⚡ Email được gửi tự động - Vui lòng không trả lời email này</p>
          </div>
        </div>
      </div>
    `

    // Thử gửi qua nhiều dịch vụ email
    let emailSent = false;
    let emailResult = null;

    // Thử Resend trước (cần API key)
    try {
      const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
      if (RESEND_API_KEY) {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'SMM Panel <orders@yourdomain.com>',
            to: ['phile140307@gmail.com'],
            subject: `🎉 ĐƠN HÀNG MỚI #${orderId?.slice(-8) || 'unknown'} - ${totalAmount?.toLocaleString?.() || totalAmount}đ - ${customerName}`,
            html: emailHtml,
          }),
        });

        if (resendResponse.ok) {
          emailResult = await resendResponse.json();
          emailSent = true;
          console.log('✅ Email sent via Resend successfully');
        }
      }
    } catch (resendError) {
      console.log('❌ Resend failed:', resendError.message);
    }

    // Nếu Resend không thành công, thử SendGrid
    if (!emailSent) {
      try {
        const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
        if (SENDGRID_API_KEY) {
          const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SENDGRID_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalizations: [{
                to: [{ email: 'phile140307@gmail.com' }],
                subject: `🎉 ĐƠN HÀNG MỚI #${orderId?.slice(-8) || 'unknown'} - ${totalAmount?.toLocaleString?.() || totalAmount}đ`
              }],
              from: { email: 'orders@yourdomain.com', name: 'SMM Panel' },
              content: [{
                type: 'text/html',
                value: emailHtml
              }]
            }),
          });

          if (sendgridResponse.ok) {
            emailSent = true;
            console.log('✅ Email sent via SendGrid successfully');
          }
        }
      } catch (sendgridError) {
        console.log('❌ SendGrid failed:', sendgridError.message);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: emailSent ? 'Email notification sent successfully' : 'Order logged but email service unavailable',
        emailSent,
        emailService: emailSent ? 'Email service' : 'None',
        orderId: orderId?.slice(-8) || 'unknown',
        customerInfo: {
          name: customerName,
          email: customerEmail,
          amount: totalAmount
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('❌ Error in notification function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to process notification',
        details: 'Check function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})