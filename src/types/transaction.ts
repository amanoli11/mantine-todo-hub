export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  account: string;
}

export type CreateTransactionInput = Omit<Transaction, 'id'>;
export type UpdateTransactionInput = Partial<CreateTransactionInput>;
