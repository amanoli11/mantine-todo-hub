import { useState, useMemo } from "react";
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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
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
  IconDownload,
  IconPrinter,
} from "@tabler/icons-react";
import { Transaction } from "@/types/transaction";
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/hooks/useTransactions";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionDeleteModal } from "@/components/TransactionDeleteModal";
import { CreateTransactionInput } from "@/types/transaction";

type SortField = "date" | "description" | "amount" | "status";
type SortDirection = "asc" | "desc";

const getAccountIcon = (account: string) => {
  switch (account) {
    case "Credit Card":
      return IconCreditCard;
    case "Checking":
    case "Savings":
      return IconBuildingBank;
    default:
      return IconWallet;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "green";
    case "pending":
      return "yellow";
    case "failed":
      return "red";
    default:
      return "gray";
  }
};

export default function Transactions() {
  const { data: transactions = [], isLoading } = useTransactions();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
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
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case "description":
          comparison = a.description.localeCompare(b.description);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return data;
  }, [
    transactions,
    search,
    typeFilter,
    statusFilter,
    categoryFilter,
    sortField,
    sortDirection,
  ]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredAndSortedData.slice(start, start + itemsPerPage);
  }, [filteredAndSortedData, page]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const clearFilters = () => {
    setSearch("");
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
          title: "Success",
          message: "Transaction updated successfully",
          color: "green",
        });
      } else {
        await createMutation.mutateAsync(data);
        notifications.show({
          title: "Success",
          message: "Transaction created successfully",
          color: "green",
        });
      }
      setFormModalOpen(false);
      setSelectedTransaction(null);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to save transaction",
        color: "red",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;
    try {
      await deleteMutation.mutateAsync(selectedTransaction.id);
      notifications.show({
        title: "Success",
        message: "Transaction deleted successfully",
        color: "green",
      });
      setDeleteModalOpen(false);
      setSelectedTransaction(null);
    } catch {
      notifications.show({
        title: "Error",
        message: "Failed to delete transaction",
        color: "red",
      });
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <IconArrowUp size={14} style={{ marginLeft: 4 }} />
    ) : (
      <IconArrowDown size={14} style={{ marginLeft: 4 }} />
    );
  };

  const downloadSingleTransaction = (transaction: Transaction) => {
    const csvContent = [
      [
        "ID",
        "Date",
        "Description",
        "Type",
        "Amount",
        "Category",
        "Account",
        "Status",
      ].join(","),
      [
        transaction.id,
        transaction.date,
        `"${transaction.description}"`,
        transaction.type,
        transaction.amount.toFixed(2),
        transaction.category,
        transaction.account,
        transaction.status,
      ].join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transaction_${transaction.id}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    notifications.show({
      title: "Downloaded",
      message: `Transaction ${transaction.id} exported successfully`,
      color: "blue",
    });
  };

  const downloadAllTransactions = () => {
    const csvHeader = [
      "ID",
      "Date",
      "Description",
      "Type",
      "Amount",
      "Category",
      "Account",
      "Status",
    ].join(",");
    const csvRows = filteredAndSortedData.map((t) =>
      [
        t.id,
        t.date,
        `"${t.description}"`,
        t.type,
        t.amount.toFixed(2),
        t.category,
        t.account,
        t.status,
      ].join(",")
    );
    const csvContent = [csvHeader, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    notifications.show({
      title: "Downloaded",
      message: `${filteredAndSortedData.length} transactions exported successfully`,
      color: "blue",
    });
  };

  const printSingleTransaction = (transaction: Transaction) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Transaction Receipt - ${transaction.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #228be6; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #228be6; }
            .subtitle { color: #868e96; font-size: 12px; }
            .receipt-title { font-size: 18px; margin-top: 10px; }
            .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e9ecef; }
            .label { color: #868e96; }
            .value { font-weight: 500; }
            .amount { font-size: 24px; font-weight: bold; text-align: center; margin: 30px 0; }
            .credit { color: #40c057; }
            .debit { color: #fa5252; }
            .footer { text-align: center; margin-top: 40px; color: #868e96; font-size: 12px; }
            .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500; }
            .status-completed { background: #d3f9d8; color: #2f9e44; }
            .status-pending { background: #fff3bf; color: #f08c00; }
            .status-failed { background: #ffe3e3; color: #e03131; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">FinanceHub</div>
            <div class="subtitle">Enterprise Suite</div>
            <div class="receipt-title">Transaction Receipt</div>
          </div>
          <div class="amount ${transaction.type}">
            ${
              transaction.type === "credit" ? "+" : "-"
            }$${transaction.amount.toFixed(2)}
          </div>
          <div class="row"><span class="label">Transaction ID</span><span class="value">${
            transaction.id
          }</span></div>
          <div class="row"><span class="label">Date</span><span class="value">${new Date(
            transaction.date
          ).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}</span></div>
          <div class="row"><span class="label">Description</span><span class="value">${
            transaction.description
          }</span></div>
          <div class="row"><span class="label">Type</span><span class="value">${
            transaction.type === "credit"
              ? "Credit (Income)"
              : "Debit (Expense)"
          }</span></div>
          <div class="row"><span class="label">Category</span><span class="value">${
            transaction.category
          }</span></div>
          <div class="row"><span class="label">Account</span><span class="value">${
            transaction.account
          }</span></div>
          <div class="row"><span class="label">Status</span><span class="status status-${
            transaction.status
          }">${transaction.status}</span></div>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleString()}</p>
            <p>FinanceHub - Your Trusted Financial Partner</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const printAllTransactions = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rows = filteredAndSortedData
      .map(
        (t) => `
      <tr>
        <td>${t.id}</td>
        <td>${new Date(t.date).toLocaleDateString()}</td>
        <td>${t.description}</td>
        <td>${t.category}</td>
        <td>${t.account}</td>
        <td class="${t.type}">${
          t.type === "credit" ? "+" : "-"
        }$${t.amount.toFixed(2)}</td>
        <td><span class="status status-${t.status}">${t.status}</span></td>
      </tr>
    `
      )
      .join("");

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Transaction Report - FinanceHub</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #228be6; }
            .subtitle { color: #868e96; font-size: 12px; }
            .report-title { font-size: 18px; margin-top: 10px; }
            .summary { display: flex; justify-content: center; gap: 40px; margin: 20px 0 30px; }
            .summary-item { text-align: center; }
            .summary-label { font-size: 12px; color: #868e96; }
            .summary-value { font-size: 20px; font-weight: bold; }
            .credit { color: #40c057; }
            .debit { color: #fa5252; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #f8f9fa; text-align: left; padding: 12px 8px; border-bottom: 2px solid #dee2e6; }
            td { padding: 10px 8px; border-bottom: 1px solid #e9ecef; }
            .status { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
            .status-completed { background: #d3f9d8; color: #2f9e44; }
            .status-pending { background: #fff3bf; color: #f08c00; }
            .status-failed { background: #ffe3e3; color: #e03131; }
            .footer { text-align: center; margin-top: 40px; color: #868e96; font-size: 12px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">FinanceHub</div>
            <div class="subtitle">Enterprise Suite</div>
            <div class="report-title">Transaction Report</div>
          </div>
          <div class="summary">
            <div class="summary-item">
              <div class="summary-label">Total Credits</div>
              <div class="summary-value credit">+$${totalCredits.toLocaleString(
                "en-US",
                { minimumFractionDigits: 2 }
              )}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Debits</div>
              <div class="summary-value debit">-$${totalDebits.toLocaleString(
                "en-US",
                { minimumFractionDigits: 2 }
              )}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Net Balance</div>
              <div class="summary-value" style="color: ${
                totalCredits - totalDebits >= 0 ? "#40c057" : "#fa5252"
              }">$${(totalCredits - totalDebits).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    })}</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Account</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <div class="footer">
            <p>${
              filteredAndSortedData.length
            } transactions | Generated on ${new Date().toLocaleString()}</p>
            <p>FinanceHub - Your Trusted Financial Partner</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const totalCredits = filteredAndSortedData
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = filteredAndSortedData
    .filter((t) => t.type === "debit")
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
          <Badge
            size="lg"
            variant="light"
            color="green"
            leftSection={<IconArrowDownLeft size={14} />}
          >
            +$
            {totalCredits.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Badge>
          <Badge
            size="lg"
            variant="light"
            color="red"
            leftSection={<IconArrowUpRight size={14} />}
          >
            -$
            {totalDebits.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Badge>
          <Button
            variant="light"
            leftSection={<IconPrinter size={16} />}
            onClick={printAllTransactions}
          >
            Print
          </Button>
          <Button
            variant="light"
            leftSection={<IconDownload size={16} />}
            onClick={downloadAllTransactions}
          >
            Export CSV
          </Button>
          <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
            Add Transaction
          </Button>
        </Group>
      </Group>

      {/* Filters */}
      <Paper radius="md" mb="lg" shadow="xs">
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
              { value: "credit", label: "Credit" },
              { value: "debit", label: "Debit" },
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
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
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
          <ActionIcon
            variant="light"
            color="gray"
            size="lg"
            onClick={clearFilters}
          >
            <IconRefresh size={18} />
          </ActionIcon>
        </Group>
      </Paper>

      {/* Table */}
      <Paper radius="md" withBorder>
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover withRowBorders={false}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Transaction ID</Table.Th>
                <Table.Th
                  onClick={() => handleSort("date")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <Group gap={4}>
                    Date
                    <SortIcon field="date" />
                  </Group>
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort("description")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <Group gap={4}>
                    Description
                    <SortIcon field="description" />
                  </Group>
                </Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Account</Table.Th>
                <Table.Th
                  onClick={() => handleSort("amount")}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <Group gap={4}>
                    Amount
                    <SortIcon field="amount" />
                  </Group>
                </Table.Th>
                <Table.Th
                  onClick={() => handleSort("status")}
                  style={{ cursor: "pointer", userSelect: "none" }}
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
                          {new Date(transaction.date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="sm">
                          <ThemeIcon
                            size={32}
                            radius="md"
                            variant="light"
                            color={
                              transaction.type === "credit" ? "green" : "red"
                            }
                          >
                            {transaction.type === "credit" ? (
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
                          c={transaction.type === "credit" ? "green" : "red"}
                        >
                          {transaction.type === "credit" ? "+" : "-"}$
                          {transaction.amount.toLocaleString("en-US", {
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
                            <Menu.Item
                              leftSection={<IconDownload size={14} />}
                              onClick={() =>
                                downloadSingleTransaction(transaction)
                              }
                            >
                              Download
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconPrinter size={14} />}
                              onClick={() =>
                                printSingleTransaction(transaction)
                              }
                            >
                              Print
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
          style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
        >
          <Text size="sm" c="dimmed">
            Showing{" "}
            {filteredAndSortedData.length > 0
              ? (page - 1) * itemsPerPage + 1
              : 0}{" "}
            to {Math.min(page * itemsPerPage, filteredAndSortedData.length)} of{" "}
            {filteredAndSortedData.length} transactions
          </Text>
          <Pagination
            total={totalPages}
            value={page}
            onChange={setPage}
            size="sm"
          />
        </Group>
      </Paper>

      {/* Create/Edit Modal */}
      <Modal
        opened={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedTransaction(null);
        }}
        title={selectedTransaction ? "Edit Transaction" : "Add Transaction"}
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
              <Badge
                color={selectedTransaction.type === "credit" ? "green" : "red"}
              >
                {selectedTransaction.type}
              </Badge>
            </Group>
            <Group justify="space-between" mb="sm">
              <Text size="sm" c="dimmed">
                Amount
              </Text>
              <Text
                size="sm"
                fw={700}
                c={selectedTransaction.type === "credit" ? "green" : "red"}
              >
                {selectedTransaction.type === "credit" ? "+" : "-"}$
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
