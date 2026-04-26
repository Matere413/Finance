export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  is_income: boolean;
  budget?: string;
  user_id: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: string;
  date: string;
  category_id: number;
  category?: Category;
  user_id: number;
  group_id?: number;
  created_at: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  color: string;
  initial: string;
  role?: string;
  created_at: string;
  created_by: number;
  member_count?: number;
}

export interface GroupMember {
  id: number;
  group_id: number;
  user_id: number;
  user?: User;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface DashboardStats {
  balance: number;
  income: number;
  expenses: number;
  savings_rate: number;
}

export interface CategorySpending {
  category_id: number;
  category_name: string;
  color: string;
  spent: number;
  budget?: number;
}

export interface DashboardData {
  stats: DashboardStats;
  categories: CategorySpending[];
  recent_transactions: Transaction[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiError {
  detail: string;
}
