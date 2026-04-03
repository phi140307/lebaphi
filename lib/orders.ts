
import { supabase } from './supabase';

export interface OrderItem {
  id: string;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  targetUrl: string;
  notes?: string;
}

export interface Order {
  id: string;
  user_id: string; // Đổi từ userId thành user_id để khớp với database
  items: OrderItem[];
  total_amount: number; // Đổi từ totalAmount thành total_amount
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  payment_method: 'balance' | 'stripe'; // Đổi từ paymentMethod thành payment_method
  created_at: string; // Đổi từ createdAt thành created_at
  updated_at: string; // Đổi từ updatedAt thành updated_at
  completed_at?: string; // Đổi từ completedAt thành completed_at
}

export const createOrder = async (orderData: {
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'balance' | 'stripe';
  userId: string;
}) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([
      {
        user_id: orderData.userId,
        items: orderData.items,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        status: 'processing'
      }
    ])
    .select()

  return { data, error }
}

export const getOrders = async (userId?: string) => {
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query
  return { data, error }
}

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const updateData: any = { 
    status, 
    updated_at: new Date().toISOString() 
  }

  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()

  return { data, error }
}

export const getOrderById = async (orderId: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  return { data, error }
}
