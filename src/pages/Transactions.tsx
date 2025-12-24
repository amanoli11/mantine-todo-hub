import { useState, useMemo } from 'react';
import {
  Paper,
  Title,
  Text,
  Box,
  Group,
  Badge,
  Table,
  TextInput,
  Select,
  ActionIcon,
  Menu,
  Pagination,
  Stack,
  ThemeIcon,
  Avatar,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconArrowUp,
  IconArrowDown,
  IconDotsVertical,
  IconEye,
  IconDownload,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconRefresh,
  IconCreditCard,
  IconBuildingBank,
  IconWallet,
} from '@tabler/icons-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  account: string;
}

const mockTransactions: Transaction[] = [
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
  { id: 'TXN013', date: '2024-12-14', description: 'Interest Earned', category: 'Income', type: 'credit', amount: 12.45, status: 'completed', account: 'Savings' },
  { id: 'TXN014', date: '2024-12-13', description: 'Phone Bill', category: 'Utilities', type: 'debit', amount: 85.00, status: 'completed', account: 'Checking' },
  { id: 'TXN015', date: '2024-12-13', description: 'Uber Ride', category: 'Transportation', type: 'debit', amount: 23.50, status: 'completed', account: 'Debit Card' },
  { id: 'TXN016', date: '2024-12-12', description: 'Bonus Payment', category: 'Income', type: 'credit', amount: 3000.00, status: 'pending', account: 'Checking' },
  { id: 'TXN017', date: '2024-12-12', description: 'Coffee Shop', category: 'Food', type: 'debit', amount: 5.75, status: 'completed', account: 'Debit Card' },
  { id: 'TXN018', date: '2024-12-11', description: 'Book Purchase', category: 'Shopping', type: 'debit', amount: 29.99, status: 'completed', account: 'Credit Card' },
  { id: 'TXN019', date: '2024-12-11', description: 'Refund - Returns', category: 'Shopping', type: 'credit', amount: 45.00, status: 'completed', account: 'Credit Card' },
  { id: 'TXN020', date: '2024-12-10', description: 'Spotify Premium', category: 'Entertainment', type: 'debit', amount: 9.99, status: 'completed', account: 'Credit Card' },
];

type SortField = 'date' | 'description' | 'amount' | 'status';
type SortDirection = 'asc' | 'desc';

const getAccountIcon = (account: string) => {
  switch (account) {
    case 'Credit Card':
      return IconCreditCard;
    case 'Checking':
    case 'Savings':
      return IconBuildingBank;
    default:
      return IconWallet;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'failed':
      return 'red';
    default:
      return 'gray';
  }
};

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const categories = useMemo(() => {
    const unique = [...new Set(mockTransactions.map((t) => t.category))];
    return unique.map((c) => ({ value: c, label: c }));
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let data = [...mockTransactions];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.id.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      data = data.filter((t) => t.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter) {
      data = data.filter((t) => t.status === statusFilter);
    }

    // Apply category filter
    if (categoryFilter) {
      data = data.filter((t) => t.category === categoryFilter);
    }

    // Apply sorting
    data.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'description':
          comparison = a.description.localeCompare(b.description);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return data;
  }, [search, typeFilter, statusFilter, categoryFilter, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, page]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setTypeFilter(null);
    setStatusFilter(null);
    setCategoryFilter(null);
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <IconArrowUp size={14} style={{ marginLeft: 4 }} />
    ) : (
      <IconArrowDown size={14} style={{ marginLeft: 4 }} />
    );
  };

  // Calculate summary stats
  const totalCredits = filteredAndSortedData
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = filteredAndSortedData
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Box>
      <Group justify="space-between" align="center" mb="xl">
        <Box>
          <Title order={2} fw={700}>
            Transactions
          </Title>
          <Text c="dimmed" size="sm">
            View and manage your transaction history
          </Text>
        </Box>
        <Group>
          <Badge size="lg" variant="light" color="green" leftSection={<IconArrowDownLeft size={14} />}>
            +${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Badge>
          <Badge size="lg" variant="light" color="red" leftSection={<IconArrowUpRight size={14} />}>
            -${totalDebits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Badge>
        </Group>
      </Group>

      {/* Filters */}
      <Paper p="md" radius="md" withBorder mb="lg">
        <Group gap="md" wrap="wrap">
          <TextInput
            placeholder="Search transactions..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => {
              setSearch(e.currentTarget.value);
              setPage(1);
            }}
            style={{ flex: 1, minWidth: 200 }}
          />
          <Select
            placeholder="Type"
            leftSection={<IconFilter size={16} />}
            data={[
              { value: 'credit', label: 'Credit' },
              { value: 'debit', label: 'Debit' },
            ]}
            value={typeFilter}
            onChange={(value) => {
              setTypeFilter(value);
              setPage(1);
            }}
            clearable
            w={130}
          />
          <Select
            placeholder="Status"
            data={[
              { value: 'completed', label: 'Completed' },
              { value: 'pending', label: 'Pending' },
              { value: 'failed', label: 'Failed' },
            ]}
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
            }}
            clearable
            w={140}
          />
          <Select
            placeholder="Category"
            data={categories}
            value={categoryFilter}
            onChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
            clearable
            w={150}
          />
          <ActionIcon variant="light" color="gray" size="lg" onClick={clearFilters}>
            <IconRefresh size={18} />
          </ActionIcon>
        </Group>
      </Paper>

      {/* Table */}
      <Paper radius="md" withBorder>
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Transaction ID</Table.Th>
                <Table.Th
                  onClick={() => handleSort('date')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Group gap={4}>
                    Date
                    <SortIcon field="date" />
                  </Group>
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('description')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Group gap={4}>
                    Description
                    <SortIcon field="description" />
                  </Group>
                </Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Account</Table.Th>
                <Table.Th
                  onClick={() => handleSort('amount')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Group gap={4}>
                    Amount
                    <SortIcon field="amount" />
                  </Group>
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort('status')}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <Group gap={4}>
                    Status
                    <SortIcon field="status" />
                  </Group>
                </Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedData.map((transaction) => {
                const AccountIcon = getAccountIcon(transaction.account);
                return (
                  <Table.Tr key={transaction.id}>
                    <Table.Td>
                      <Text size="sm" fw={500} c="dimmed">
                        {transaction.id}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">
                        {new Date(transaction.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm">
                        <ThemeIcon
                          size={32}
                          radius="md"
                          variant="light"
                          color={transaction.type === 'credit' ? 'green' : 'red'}
                        >
                          {transaction.type === 'credit' ? (
                            <IconArrowDownLeft size={16} />
                          ) : (
                            <IconArrowUpRight size={16} />
                          )}
                        </ThemeIcon>
                        <Text size="sm" fw={500}>
                          {transaction.description}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Badge variant="light" color="blue" size="sm">
                        {transaction.category}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <Avatar size={24} radius="xl" color="gray">
                          <AccountIcon size={14} />
                        </Avatar>
                        <Text size="sm">{transaction.account}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text
                        size="sm"
                        fw={600}
                        c={transaction.type === 'credit' ? 'green' : 'red'}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}$
                        {transaction.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Badge
                        variant="light"
                        color={getStatusColor(transaction.status)}
                        size="sm"
                        tt="capitalize"
                      >
                        {transaction.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Menu shadow="md" width={160}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item leftSection={<IconEye size={14} />}>View Details</Menu.Item>
                          <Menu.Item leftSection={<IconDownload size={14} />}>
                            Download Receipt
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {/* Pagination */}
        <Group justify="space-between" p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}>
          <Text size="sm" c="dimmed">
            Showing {(page - 1) * itemsPerPage + 1} to{' '}
            {Math.min(page * itemsPerPage, filteredAndSortedData.length)} of{' '}
            {filteredAndSortedData.length} transactions
          </Text>
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </Group>
      </Paper>
    </Box>
  );
}
