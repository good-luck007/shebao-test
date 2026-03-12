import { createClient } from '@supabase/supabase-js'

// 支持客户端和服务器端的环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''

// 检查是否已配置 Supabase
const isConfigured = supabaseUrl.startsWith('https://') && supabaseAnonKey

if (!isConfigured) {
  console.warn('Supabase 未配置，请检查 .env.local 文件')
}

// 创建虚拟的 Supabase 查询构建器
const createMockQueryBuilder = () => ({
  select: () => ({
    data: null,
    error: new Error('Supabase 未配置'),
    single: () => ({ data: null, error: new Error('Supabase 未配置') }),
  }),
  insert: () => ({
    data: null,
    error: new Error('Supabase 未配置'),
  }),
  update: () => ({
    data: null,
    error: new Error('Supabase 未配置'),
  }),
  delete: () => ({
    data: null,
    error: new Error('Supabase 未配置'),
  }),
  upsert: () => ({
    data: null,
    error: new Error('Supabase 未配置'),
  }),
  eq: function() { return this; },
  neq: function() { return this; },
  order: function() { return this; },
  then: function(resolve: any, reject: any) {
    return Promise.resolve({ data: null, error: new Error('Supabase 未配置') }).then(resolve, reject);
  },
});

// 创建 Supabase 客户端（如果未配置，创建一个虚拟客户端）
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: () => createMockQueryBuilder(),
    } as any
