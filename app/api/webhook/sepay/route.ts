import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('SePay webhook received:', body);

    const {
      order_invoice_number,
      order_amount,
      payment_status,
      transaction_id,
      payment_method
    } = body;

    if (!order_invoice_number) {
      return NextResponse.json({ error: 'Missing order_invoice_number' }, { status: 400 });
    }

    if (payment_status !== 'success') {
      console.log('Payment not successful:', payment_status);
      return NextResponse.json({ status: 'received' });
    }

    const orderId = order_invoice_number;

    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError || !existingOrder) {
      console.log('Order not found or already processed:', orderId);
      return NextResponse.json({ status: 'received' });
    }

    if (existingOrder.status === 'completed') {
      console.log('Order already completed:', orderId);
      return NextResponse.json({ status: 'received' });
    }

    const { error: updateError } = await supabase
      .from('orders')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
        payment_info: {
          transaction_id,
          payment_method,
          paid_at: new Date().toISOString(),
          amount: order_amount
        }
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    console.log('Order completed successfully:', orderId);
    return NextResponse.json({ status: 'success' });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}