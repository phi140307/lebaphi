
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  username: string
  email: string
  full_name?: string
  phone?: string
  created_at: string
  updated_at: string
  status: 'active' | 'inactive' | 'suspended'
  last_login?: string
  balance?: number
  deposit_code?: string
  total_deposited?: number
  total_spent?: number
}

export const registerUser = async (userData: {
  username: string
  email: string
  password: string
  full_name?: string
  phone?: string
}) => {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        username: userData.username,
        email: userData.email,
        password_hash: userData.password, // In production, hash the password
        full_name: userData.full_name,
        phone: userData.phone,
        total_deposited: 0,
        total_spent: 0
      }
    ])
    .select()

  return { data, error }
}

export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  return { data, error }
}

export const searchUsers = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .or(`username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false })

  return { data, error }
}

export const updateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
  const { data, error } = await supabase
    .from('users')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()

  return { data, error }
}

export const updateUser = async (userId: string, userData: {
  full_name?: string
  phone?: string
  email?: string
  balance?: number
}) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      ...userData,
      updated_at: new Date().toISOString() 
    })
    .eq('id', userId)
    .select()

  return { data, error }
}

export const updateUserBalance = async (userId: string, newBalance: number) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      balance: newBalance,
      updated_at: new Date().toISOString() 
    })
    .eq('id', userId)
    .select()

  return { data, error }
}

export const generateDepositCode = (userId: string): string => {
  const timestamp = Date.now().toString().slice(-6)
  const userIdHash = userId.slice(-4)
  return `NAPTIEN${userIdHash}${timestamp}`.toUpperCase()
}

export const updateUserDepositCode = async (userId: string, depositCode: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ 
      deposit_code: depositCode,
      updated_at: new Date().toISOString() 
    })
    .eq('id', userId)
    .select()

  return { data, error }
}

export const getUserByDepositCode = async (depositCode: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('deposit_code', depositCode)
    .single()

  return { data, error }
}

export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export const createDepositTransaction = async (transactionData: {
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'payment';
  description: string;
  status: 'pending' | 'completed' | 'failed';
}) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: transactionData.userId,
        amount: transactionData.amount,
        type: transactionData.type,
        description: transactionData.description,
        status: transactionData.status
      }
    ])
    .select()

  return { data, error }
}

export const loginUser = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password_hash', password)
    .eq('status', 'active')
    .single()

  if (data && !error) {
    // Cập nhật thời gian đăng nhập cuối
    await supabase
      .from('users')
      .update({
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', data.id)
  }

  return { data, error }
}

export const updateUserTotals = async (userId: string, depositAmount?: number, spentAmount?: number) => {
  try {
    // Lấy thông tin user hiện tại
    const { data: currentUser, error: getUserError } = await getUserById(userId)
    if (getUserError || !currentUser) {
      return { data: null, error: getUserError || new Error('User not found') }
    }

    const currentTotalDeposited = currentUser.total_deposited || 0
    const currentTotalSpent = currentUser.total_spent || 0

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    // Cập nhật tổng nạp nếu có
    if (depositAmount && depositAmount > 0) {
      updateData.total_deposited = currentTotalDeposited + depositAmount
    }

    // Cập nhật tổng chi tiêu nếu có
    if (spentAmount && spentAmount > 0) {
      updateData.total_spent = currentTotalSpent + spentAmount
    }

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()

    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export const processDeposit = async (userId: string, amount: number) => {
  try {
    // Lấy thông tin user hiện tại
    const { data: currentUser, error: getUserError } = await getUserById(userId)
    if (getUserError || !currentUser) {
      return { data: null, error: getUserError || new Error('User not found') }
    }

    const currentBalance = currentUser.balance || 0
    const newBalance = currentBalance + amount

    // Cập nhật số dư và tổng nạp cùng lúc
    const { data, error } = await supabase
      .from('users')
      .update({ 
        balance: newBalance,
        total_deposited: (currentUser.total_deposited || 0) + amount,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId)
      .select()

    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export const processPayment = async (userId: string, amount: number) => {
  try {
    // Lấy thông tin user hiện tại
    const { data: currentUser, error: getUserError } = await getUserById(userId)
    if (getUserError || !currentUser) {
      return { data: null, error: getUserError || new Error('User not found') }
    }

    const currentBalance = currentUser.balance || 0

    // Kiểm tra số dư đủ không
    if (currentBalance < amount) {
      return { data: null, error: new Error('Insufficient balance') }
    }

    const newBalance = currentBalance - amount

    // Cập nhật số dư và tổng chi tiêu cùng lúc
    const { data, error } = await supabase
      .from('users')
      .update({ 
        balance: newBalance,
        total_spent: (currentUser.total_spent || 0) + amount,
        updated_at: new Date().toISOString() 
      })
      .eq('id', userId)
      .select()

    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}

export const resetAllUserTotals = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ 
        total_deposited: 0,
        total_spent: 0,
        updated_at: new Date().toISOString() 
      })
      .neq('id', 'null') // Cập nhật tất cả users

    return { data, error }
  } catch (err) {
    return { data: null, error: err }
  }
}
