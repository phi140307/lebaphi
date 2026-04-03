import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    if (req.method === 'POST') {
      // Webhook từ ngân hàng hoặc API kiểm tra giao dịch
      const { transactionInfo } = await req.json()
      
      const { amount, content, timestamp } = transactionInfo
      
      // Tìm user theo nội dung chuyển khoản (username)
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('username', content.trim())
        .single()

      if (userError || !user) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Không tìm thấy user với username: ${content}` 
          }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Cập nhật số dư tự động
      const currentBalance = user.balance || 0
      const newBalance = currentBalance + amount
      
      // Tính bonus (giống như trang nạp tiền)
      let bonusAmount = 0
      if (amount >= 2000000) bonusAmount = Math.floor(amount * 0.2)
      else if (amount >= 1000000) bonusAmount = Math.floor(amount * 0.15)
      else if (amount >= 500000) bonusAmount = Math.floor(amount * 0.1)
      else if (amount >= 100000) bonusAmount = Math.floor(amount * 0.05)

      const finalBalance = newBalance + bonusAmount

      // Cập nhật số dư và tổng nạp
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          balance: finalBalance,
          total_deposited: (user.total_deposited || 0) + amount + bonusAmount,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      // Tạo giao dịch trong database
      await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: amount + bonusAmount,
          type: 'deposit',
          description: `Nạp tiền tự động: ${amount.toLocaleString()}đ${bonusAmount > 0 ? ` + ${bonusAmount.toLocaleString()}đ bonus` : ''}`,
          status: 'completed'
        }])

      // Gửi thông báo cho user
      await supabase
        .from('user_notifications')
        .insert([{
          user_id: user.id,
          title: '💰 Nạp tiền thành công',
          message: `Đã cộng ${(amount + bonusAmount).toLocaleString()}đ vào tài khoản. Số dư mới: ${finalBalance.toLocaleString()}đ`,
          type: 'deposit_success',
          is_read: false
        }])

      return new Response(
        JSON.stringify({ 
          success: true,
          message: `Đã cộng ${(amount + bonusAmount).toLocaleString()}đ cho ${user.username}`,
          userInfo: {
            username: user.username,
            oldBalance: currentBalance,
            depositAmount: amount,
            bonusAmount: bonusAmount,
            newBalance: finalBalance
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'GET') {
      // API để kiểm tra giao dịch Vietcombank (cần tích hợp với API ngân hàng)
      // Đây là ví dụ giả lập
      
      const url = new URL(req.url)
      const checkTime = url.searchParams.get('checkTime') || '5' // Kiểm tra 5 phút gần nhất
      
      // Giả lập dữ liệu giao dịch từ Vietcombank
      // Trong thực tế, bạn cần tích hợp với API ngân hàng hoặc dịch vụ như:
      // - VietQR API
      // - Banking API
      // - Web scraping (không khuyến khích)
      
      const mockTransactions = [
        {
          amount: 100000,
          content: "demo_user",
          time: new Date().toISOString(),
          transId: "VCB_" + Date.now()
        }
      ]

      // Xử lý từng giao dịch
      const results = []
      for (const trans of mockTransactions) {
        try {
          // Tìm user theo nội dung
          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('username', trans.content.trim())
            .single()

          if (user) {
            // Cập nhật số dư tự động (tương tự như webhook)
            const currentBalance = user.balance || 0
            let bonusAmount = 0
            if (trans.amount >= 100000) bonusAmount = Math.floor(trans.amount * 0.05)
            
            const newBalance = currentBalance + trans.amount + bonusAmount

            await supabase
              .from('users')
              .update({ 
                balance: newBalance,
                total_deposited: (user.total_deposited || 0) + trans.amount + bonusAmount,
                updated_at: new Date().toISOString()
              })
              .eq('id', user.id)

            results.push({
              success: true,
              username: user.username,
              amount: trans.amount + bonusAmount,
              newBalance: newBalance
            })
          }
        } catch (error) {
          results.push({
            success: false,
            content: trans.content,
            error: error.message
          })
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          message: `Đã kiểm tra ${mockTransactions.length} giao dịch`,
          results: results
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

  } catch (error) {
    console.error('❌ Error in auto deposit checker:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})