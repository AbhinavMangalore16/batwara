export interface User{
    id: string;
    name: string;
    email: string;
    avatar?: string;
}
export interface Balance{
    id: string;
    name: string;
    email: string;
    balance: number;
}

export interface Settlement{
    id: string;
    from: User;
    to: User;
    amount: number;
    created_at: string;
}

export interface BillPayload{
    description: string;
    totalAmount: number;
    splitType: 'EQUAL' | 'EXACT' | 'PERCENTAGE';
    participants: string[]
}

export interface PatchUserPayload {
  name?: string;
  // Add other patchable fields
}

export interface AddFriendPayload {
  friendId: string;
}