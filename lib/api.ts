// src/lib/api.ts
import { User,Balance, Settlement, BillPayload, PatchUserPayload, AddFriendPayload } from "@/types";

// Ensure this matches your Express Backend URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/expenses';

async function fetcher<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    // CRITICAL: Sends the 'better-auth.session_token' cookie to backend
    credentials: 'include', 
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || 'API Request Failed');
  }

  return data;
}

export const api = {
    // Helper to read stored user id at call time
    _getStoredUserId: (): string | null => {
      try {
        if (typeof window === 'undefined') return null;
        const raw = localStorage.getItem('auth_user');
        if (!raw) return null;
        const u = JSON.parse(raw);
        return u?.id || null;
      } catch (e) {
        return null;
      }
    },

    // 1. Get Net Balance (Graph Logic)
    getMyBalance: () => {
      const id = typeof window !== 'undefined' ? (localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user') as string).id : null) : null;
      const path = id ? `/balances/user/${id}` : '/balances';
      return fetcher<{ balance: Balance }>(path);
    },

    // 2. Get Pending Settlements
    getMySettlements: () => {
      const id = typeof window !== 'undefined' ? (localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user') as string).id : null) : null;
      const path = id ? `/settlements/user/${id}` : '/settlements';
      return fetcher<{ settlements: Settlement[] }>(path);
    },

  // 3. Trigger Heap Algorithm (Optimize & Persist)
  optimizeDebts: () => 
    fetcher<{ settlements: Settlement[] }>('/settlements/optimized/persist', { method: 'POST' }),

  // 4. Pay a Settlement
  paySettlement: (id: string) => 
    fetcher<{ result: any }>(`/settlements/${id}/pay`, { method: 'POST' }),

  // 5. Create a Bill
  createBill: (data: BillPayload) => 
    fetcher<{ result: any }>('/makeBill', { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),
    getMe: () => 
    fetcher<User>('/users/me'),

  // PATCH /api/users/me
  updateProfile: (data: PatchUserPayload) => 
    fetcher<User>('/users/me', { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),

  // GET /api/users/check?email=...
  checkUserExists: (email: string) => 
    fetcher<{ exists: boolean, user?: User }>(`/users/check?email=${encodeURIComponent(email)}`),

  // GET /api/users/search?name=...
  searchUsers: (name: string) =>
    fetcher<{ users: User[] }>(`/users/search?name=${encodeURIComponent(name)}`),

  // POST /api/users/add
  addFriend: (friendId: string) => 
    fetcher<{ message: string }>('/users/add', { 
      method: 'POST', 
      body: JSON.stringify({ friendId }) 
    }),
  
  // GET /api/users/friends
  getMyFriends: () =>
    fetcher<{ friends: User[] }>('/users/friends'),
};