import { useEffect } from 'react';
import { TextInput, Select, Button, Stack, Group, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Transaction, CreateTransactionInput } from '@/types/transaction';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSubmit: (data: CreateTransactionInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categories = [
  'Income',
  'Shopping',
  'Utilities',
  'Investment',
  'Food',
  'Transfer',
  'Entertainment',
  'Transportation',
  'Insurance',
  'Health',
  'Other',
];

const accounts = ['Checking', 'Savings', 'Credit Card', 'Debit Card', 'Investment'];

export function TransactionForm({ transaction, onSubmit, onCancel, isLoading }: TransactionFormProps) {
  const form = useForm<CreateTransactionInput>({
    initialValues: {
      date: transaction?.date || new Date().toISOString().split('T')[0],
      description: transaction?.description || '',
      category: transaction?.category || 'Other',
      type: transaction?.type || 'debit',
      amount: transaction?.amount || 0,
      status: transaction?.status || 'completed',
      account: transaction?.account || 'Checking',
    },
    validate: {
      description: (value) => (value.trim().length < 2 ? 'Description is required' : null),
      amount: (value) => (value <= 0 ? 'Amount must be greater than 0' : null),
    },
  });

  useEffect(() => {
    if (transaction) {
      form.setValues({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        account: transaction.account,
      });
    }
  }, [transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = form.validate();
    if (!validation.hasErrors) {
      onSubmit(form.values);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Date"
          type="date"
          required
          {...form.getInputProps('date')}
          styles={{ input: { borderRadius: '0.5rem' } }}
        />

        <TextInput
          label="Description"
          placeholder="Enter transaction description"
          required
          {...form.getInputProps('description')}
          styles={{ input: { borderRadius: '0.5rem' } }}
        />

        <Group grow>
          <Select
            label="Type"
            required
            data={[
              { value: 'credit', label: 'Credit (Income)' },
              { value: 'debit', label: 'Debit (Expense)' },
            ]}
            value={form.values.type}
            onChange={(value) => form.setFieldValue('type', (value || 'debit') as 'credit' | 'debit')}
            styles={{ input: { borderRadius: '0.5rem' } }}
          />

          <NumberInput
            label="Amount"
            placeholder="0.00"
            required
            min={0}
            decimalScale={2}
            fixedDecimalScale
            prefix="$"
            {...form.getInputProps('amount')}
            styles={{ input: { borderRadius: '0.5rem' } }}
          />
        </Group>

        <Group grow>
          <Select
            label="Category"
            required
            data={categories.map((c) => ({ value: c, label: c }))}
            value={form.values.category}
            onChange={(value) => form.setFieldValue('category', value || 'Other')}
            styles={{ input: { borderRadius: '0.5rem' } }}
          />

          <Select
            label="Account"
            required
            data={accounts.map((a) => ({ value: a, label: a }))}
            value={form.values.account}
            onChange={(value) => form.setFieldValue('account', value || 'Checking')}
            styles={{ input: { borderRadius: '0.5rem' } }}
          />
        </Group>

        <Select
          label="Status"
          required
          data={[
            { value: 'completed', label: 'Completed' },
            { value: 'pending', label: 'Pending' },
            { value: 'failed', label: 'Failed' },
          ]}
          value={form.values.status}
          onChange={(value) =>
            form.setFieldValue('status', (value || 'completed') as 'completed' | 'pending' | 'failed')
          }
          styles={{ input: { borderRadius: '0.5rem' } }}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {transaction ? 'Update Transaction' : 'Create Transaction'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
