import { Modal, Text, Button, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { Transaction } from '@/types/transaction';

interface TransactionDeleteModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
  isLoading?: boolean;
}

export function TransactionDeleteModal({
  opened,
  onClose,
  onConfirm,
  transaction,
  isLoading,
}: TransactionDeleteModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Deletion" centered radius="md">
      <Stack align="center" gap="md" py="md">
        <ThemeIcon size={60} radius="xl" color="red" variant="light">
          <IconAlertTriangle size={32} />
        </ThemeIcon>
        <Text ta="center" size="lg" fw={500}>
          Are you sure you want to delete this transaction?
        </Text>
        <Text ta="center" c="dimmed">
          This action cannot be undone. Transaction <strong>{transaction?.id}</strong> for{' '}
          <strong>${transaction?.amount.toFixed(2)}</strong> will be permanently removed.
        </Text>
      </Stack>

      <Group justify="flex-end" mt="xl">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm} loading={isLoading}>
          Delete Transaction
        </Button>
      </Group>
    </Modal>
  );
}
