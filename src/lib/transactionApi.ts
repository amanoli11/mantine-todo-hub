import { Transaction, CreateTransactionInput, UpdateTransactionInput } from '@/types/transaction';

const STORAGE_KEY = 'financehub_transactions';

const defaultTransactions: Transaction[] = [
  { id: 'TXN001', date: '2024-12-20', description: 'Salary Deposit', category: 'Income', type: 'credit', amount: 8500, status: 'completed', account: 'Checking' },
  { id: 'TXN002', date: '2024-12-19', description: 'Amazon Purchase', category: 'Shopping', type: 'debit', amount: 156.99, status: 'completed', account: 'Credit Card' },
  { id: 'TXN003', date: '2024-12-19', description: 'Electric Bill', category: 'Utilities', type: 'debit', amount: 124.50, status: 'completed', account: 'Checking' },
  { id: 'TXN004', date: '2024-12-18', description: 'Stock Dividend', category: 'Investment', type: 'credit', amount: 245.00, status: 'completed', account: 'Investment' },
  { id: 'TXN005', date: '2024-12-18', description: 'Grocery Store', category: 'Food', type: 'debit', amount: 89.32, status: 'completed', account: 'Debit Card' },
  { id: 'TXN006', date: '2024-12-17', description: 'Wire Transfer', category: 'Transfer', type: 'credit', amount: 2500.00, status: 'pending', account: 'Savings' },
  { id: 'TXN007', date: '2024-12-17', description: 'Netflix Subscription', category: 'Entertainment', type: 'debit', amount: 15.99, status: 'completed', account: 'Credit Card' },
  { id: 'TXN008', date: '2024-12-16', description: 'Gas Station', category: 'Transportation', type: 'debit', amount: 45.00, status: 'completed', account: 'Debit Card' },
  { id: 'TXN009', date: '2024-12-16', description: 'Freelance Payment', category: 'Income', type: 'credit', amount: 1200.00, status: 'completed', account: 'Checking' },
  { id: 'TXN010', date: '2024-12-15', description: 'Restaurant', category: 'Food', type: 'debit', amount: 67.50, status: 'completed', account: 'Credit Card' },
  { id: 'TXN011', date: '2024-12-15', description: 'Insurance Premium', category: 'Insurance', type: 'debit', amount: 350.00, status: 'failed', account: 'Checking' },
  { id: 'TXN012', date: '2024-12-14', description: 'Gym Membership', category: 'Health', type: 'debit', amount: 49.99, status: 'completed', account: 'Credit Card' },
];

const getStoredTransactions = (): Transaction[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTransactions));
  return defaultTransactions;
};

const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
};

const generateId = (): string => {
  const transactions = getStoredTransactions();
  const maxNum = transactions.reduce((max, t) => {
    const num = parseInt(t.id.replace('TXN', ''), 10);
    return num > max ? num : max;
  }, 0);
  return `TXN${String(maxNum + 1).padStart(3, '0')}`;
};

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const transactionApi = {
  getAll: async (): Promise<Transaction[]> => {
    await delay(300);
    return getStoredTransactions();
  },

  getById: async (id: string): Promise<Transaction | undefined> => {
    await delay(200);
    const transactions = getStoredTransactions();
    return transactions.find((t) => t.id === id);
  },

  create: async (input: CreateTransactionInput): Promise<Transaction> => {
    await delay(400);
    const transactions = getStoredTransactions();
    const newTransaction: Transaction = {
      ...input,
      id: generateId(),
    };
    transactions.unshift(newTransaction);
    saveTransactions(transactions);
    return newTransaction;
  },

  update: async (id: string, input: UpdateTransactionInput): Promise<Transaction> => {
    await delay(400);
    const transactions = getStoredTransactions();
    const index = transactions.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }
    transactions[index] = { ...transactions[index], ...input };
    saveTransactions(transactions);
    return transactions[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const transactions = getStoredTransactions();
    const filtered = transactions.filter((t) => t.id !== id);
    saveTransactions(filtered);
  },
};
