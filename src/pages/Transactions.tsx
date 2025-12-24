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
  ThemeIcon,
  Avatar,
  Button,
  Modal,
  Skeleton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconSearch,
  IconFilter,
  IconArrowUp,
  IconArrowDown,
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconTrash,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconRefresh,
  IconCreditCard,
  IconBuildingBank,
  IconWallet,
  IconPlus,
} from '@tabler/icons-react';
import { Transaction } from '@/types/transaction';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/hooks/useTransactions';
import { TransactionForm } from '@/components/TransactionForm';
import { TransactionDeleteModal } from '@/components/TransactionDeleteModal';
import { CreateTransactionInput } from '@/types/transaction';

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
  const { data: transactions = [], isLoading } = useTransactions();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const categories = useMemo(() => {
    const unique = [...new Set(transactions.map((t) => t.category))];
    return unique.map((c) => ({ value: c, label: c }));
  }, [transactions]);

  const filteredAndSortedData = useMemo(() => {
    let data = [...transactions];

    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(
        (t) =>
          t.description.toLowerCase().includes(searchLower) ||
          t.id.toLowerCase().includes(searchLower) ||
          t.category.toLowerCase().includes(searchLower)
      );
    }

    if (typeFilter) {
      data = data.filter((t) => t.type === typeFilter);
    }

    if (statusFilter) {
      data = data.filter((t) => t.status === statusFilter);
    }

    if (categoryFilter) {
      data = data.filter((t) => t.category === categoryFilter);
    }

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
  }, [transactions, search, typeFilter, statusFilter, categoryFilter, sortField, sortDirection]);

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

  const handleCreate = () => {
    setSelectedTransaction(null);
    setFormModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setFormModalOpen(true);
  };

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data: CreateTransactionInput) => {
    try {
      if (selectedTransaction) {
        await updateMutation.mutateAsync({ id: selectedTransaction.id, data });
        notifications.show({
          title: 'Success',
          message: 'Transaction updated successfully',
          color: 'green',
        });
      } else {
        await createMutation.mutateAsync(data);
        notifications.show({
          title: 'Success',
          message: 'Transaction created successfully',
          color: 'green',
        });
      }
      setFormModalOpen(false);
      setSelectedTransaction(null);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to save transaction',
        color: 'red',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;
    try {
      await deleteMutation.mutateAsync(selectedTransaction.id);
      notifications.show({
        title: 'Success',
        message: 'Transaction deleted successfully',
        color: 'green',
      });
      setDeleteModalOpen(false);
      setSelectedTransaction(null);
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete transaction',
        color: 'red',
      });
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <IconArrowUp size={14} style={{ marginLeft: 4 }} />
    ) : (
      <IconArrowDown size={14} style={{ marginLeft: 4 }} />
    );
  };

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
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
            Add Transaction
          </Button>
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <Table.Td key={j}>
                        <Skeleton height={20} />
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : paginatedData.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Text ta="center" py="xl" c="dimmed">
                      No transactions found
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                paginatedData.map((transaction) => {
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
                        <Text size="sm" fw={600} c={transaction.type === 'credit' ? 'green' : 'red'}>
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
                            <Menu.Item
                              leftSection={<IconEye size={14} />}
                              onClick={() => handleView(transaction)}
                            >
                              View Details
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconEdit size={14} />}
                              onClick={() => handleEdit(transaction)}
                            >
                              Edit
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              color="red"
                              leftSection={<IconTrash size={14} />}
                              onClick={() => handleDeleteClick(transaction)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Table.Td>
                    </Table.Tr>
                  );
                })
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        {/* Pagination */}
        <Group
          justify="space-between"
          p="md"
          style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
        >
          <Text size="sm" c="dimmed">
            Showing {filteredAndSortedData.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(page * itemsPerPage, filteredAndSortedData.length)} of{' '}
            {filteredAndSortedData.length} transactions
          </Text>
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </Group>
      </Paper>

      {/* Create/Edit Modal */}
      <Modal
        opened={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedTransaction(null);
        }}
        title={selectedTransaction ? 'Edit Transaction' : 'Add Transaction'}
        centered
        radius="md"
        size="lg"
      >
        <TransactionForm
          transaction={selectedTransaction}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setFormModalOpen(false);
            setSelectedTransaction(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        opened={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedTransaction(null);
        }}
        title="Transaction Details"
        centered
        radius="md"
      >
        {selectedTransaction && (
          <Box>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Transaction ID
              </Text>
              <Text size="sm" fw={500}>
                {selectedTransaction.id}
              </Text>
            </Group>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Date
              </Text>
              <Text size="sm" fw={500}>
                {new Date(selectedTransaction.date).toLocaleDateString()}
              </Text>
            </Group>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Description
              </Text>
              <Text size="sm" fw={500}>
                {selectedTransaction.description}
              </Text>
            </Group>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Type
              </Text>
              <Badge color={selectedTransaction.type === 'credit' ? 'green' : 'red'}>
                {selectedTransaction.type}
              </Badge>
            </Group>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Amount
              </Text>
              <Text size="sm" fw={700} c={selectedTransaction.type === 'credit' ? 'green' : 'red'}>
                {selectedTransaction.type === 'credit' ? '+' : '-'}$
                {selectedTransaction.amount.toFixed(2)}
              </Text>
            </Group>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Category
              </Text>
              <Badge variant="light">{selectedTransaction.category}</Badge>
            </Group>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Account
              </Text>
              <Text size="sm" fw={500}>
                {selectedTransaction.account}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Status
              </Text>
              <Badge color={getStatusColor(selectedTransaction.status)}>
                {selectedTransaction.status}
              </Badge>
            </Group>
          </Box>
        )}
      </Modal>

      {/* Delete Modal */}
      <TransactionDeleteModal
        opened={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTransaction(null);
        }}
        onConfirm={handleDeleteConfirm}
        transaction={selectedTransaction}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
