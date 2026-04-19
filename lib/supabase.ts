
import { createClient } from '@supabase/supabase-js'

const DEFAULT_SUPABASE_URL = 'https://minygyshbmfhzaolrhzh.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pbnlneXNoYm1maHphb2xyaHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MDYxMjEsImV4cCI6MjA5MTM4MjEyMX0.DfFvkK3yiL174fUryZfSQTHcT9LcmMfmI3IrEb0bA-k'

function sanitizeEnvValue(value?: string) {
  return value?.trim().replace(/^['\"]|['\"]$/g, '') || ''
}

function looksLikeSupabaseJwt(value: string) {
  return value.split('.').length === 3
}

const envSupabaseUrl = sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
const envSupabaseAnonKey = sanitizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const supabaseUrl = envSupabaseUrl.startsWith('https://') ? envSupabaseUrl : DEFAULT_SUPABASE_URL
const supabaseAnonKey = looksLikeSupabaseJwt(envSupabaseAnonKey) ? envSupabaseAnonKey : DEFAULT_SUPABASE_ANON_KEY

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

function isUsersTableMissingError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false
  }

  const code = 'code' in error ? String((error as { code?: string }).code || '') : ''
  const message = 'message' in error ? String((error as { message?: string }).message || '') : ''

  return code === 'PGRST205' || code === '42P01' || message.includes("public.users")
}

function mapAuthUserToProfile(user: any): User {
  const metadata = user?.user_metadata || {}

  return {
    id: user.id,
    username: metadata.username || user.email?.split('@')[0] || user.id,
    email: user.email || '',
    full_name: metadata.full_name || '',
    created_at: user.created_at || new Date().toISOString(),
    updated_at: user.updated_at || user.created_at || new Date().toISOString(),
    status: 'active',
    balance: 0,
    total_deposited: 0,
    total_spent: 0,
    last_login: user.last_sign_in_at,
  }
}

function buildUserProfilePayload(user: any, overrides?: {
  username?: string
  email?: string
  full_name?: string
  phone?: string
}) {
  const metadata = user?.user_metadata || {}

  return {
    id: user.id,
    username: overrides?.username || metadata.username || user.email?.split('@')[0] || user.id,
    email: overrides?.email || user.email || '',
    full_name: overrides?.full_name ?? metadata.full_name ?? '',
    phone: overrides?.phone ?? metadata.phone ?? null,
    balance: 0,
    total_deposited: 0,
    total_spent: 0,
    status: 'active' as const,
    last_login: user.last_sign_in_at || null,
    updated_at: new Date().toISOString(),
  }
}

async function ensureUserProfile(
  user: any,
  overrides?: {
    username?: string
    email?: string
    full_name?: string
    phone?: string
  }
) {
  const payload = buildUserProfilePayload(user, overrides)

  const { data, error } = await supabase
    .from('users')
    .upsert(payload, { onConflict: 'id' })
    .select()
    .single()

  return { data, error }
}

export const registerUser = async (userData: {
  username: string
  email: string
  password: string
  full_name?: string
  phone?: string
}) => {
  try {
    const normalizedUserData = {
      username: userData.username.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      full_name: userData.full_name?.trim(),
      phone: userData.phone?.trim(),
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedUserData.email,
      password: normalizedUserData.password,
      options: {
        data: {
          username: normalizedUserData.username,
          full_name: normalizedUserData.full_name,
          phone: normalizedUserData.phone,
        }
      }
    })

    if (error) {
      console.error('Auth signUp error details:', {
        message: error.message,
        status: error.status,
        name: error.name
      })
      return { data: null, error }
    }

    if (data.user) {
      const { error: profileError } = await ensureUserProfile(data.user, normalizedUserData)

      // When email confirmation is enabled, signUp often returns no session yet.
      // In that case an authenticated insert into public.users can fail due to RLS,
      // but the auth account has still been created successfully.
      if (profileError && !isUsersTableMissingError(profileError)) {
        console.warn('Create profile skipped after signUp:', profileError)
      }
    }

    return { data, error: null }
  } catch (error: any) {
    console.error('Register catch error:', error)
    return { 
      data: null, 
      error: {
        message: error.message || 'Unknown error',
        name: error.name || 'Error'
      }
    }
  }
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

export const loginUser = async (identifier: string, password: string) => {
  try {
    let email = identifier.trim().toLowerCase()
    let usersTableAvailable = true
    
    if (!identifier.includes('@')) {
      const { data: userData, error: userLookupError } = await supabase
        .from('users')
        .select('email')
        .eq('username', identifier.trim())
        .single()

      if (userLookupError && isUsersTableMissingError(userLookupError)) {
        usersTableAvailable = false
      } else if (userLookupError) {
        throw userLookupError
      }
      
      if (userData) {
        email = userData.email
      } else {
        return {
          data: null,
          error: new Error(
            usersTableAvailable
              ? 'User not found'
              : 'Hệ thống hiện chỉ hỗ trợ đăng nhập bằng email.'
          )
        }
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) throw error

    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle()

      if (userError && !isUsersTableMissingError(userError)) throw userError

      if (userData) {
        await supabase
          .from('users')
          .update({
            last_login: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', data.user.id)

        return { data: userData, error: null }
      }

      if (!userError) {
        const fallbackProfile = mapAuthUserToProfile(data.user)
        const { data: createdProfile, error: createProfileError } = await ensureUserProfile(data.user, {
          username: fallbackProfile.username,
          email: fallbackProfile.email,
          full_name: fallbackProfile.full_name,
        })

        if (!createProfileError && createdProfile) {
          return { data: createdProfile, error: null }
        }

        if (createProfileError && !isUsersTableMissingError(createProfileError)) {
          console.warn('Unable to create missing user profile during login:', createProfileError)
        }
      }

      return { data: mapAuthUserToProfile(data.user), error: null }
    }

    return { data: null, error: new Error('User not found') }
  } catch (error: any) {
    console.error('Login error:', error)
    return { data: null, error }
  }
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
