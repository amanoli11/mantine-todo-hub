import { Table, Avatar, Badge, ActionIcon, Group, Text, Tooltip, Loader, Center, Paper } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { User } from '@/types/user';
import { format } from 'date-fns';

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const getRoleBadgeColor = (role: User['role']) => {
  switch (role) {
    case 'Admin':
      return 'violet';
    case 'Editor':
      return 'blue';
    case 'User':
      return 'gray';
    default:
      return 'gray';
  }
};

const getStatusBadgeColor = (status: User['status']) => {
  return status === 'Active' ? 'green' : 'red';
};

export function UserTable({ users, isLoading, onEdit, onDelete }: UserTableProps) {
  if (isLoading) {
    return (
      <Center py={60}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (users.length === 0) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Center>
          <Text c="dimmed" size="lg">
            No users found. Create your first user!
          </Text>
        </Center>
      </Paper>
    );
  }

  return (
    <Paper radius="md" withBorder style={{ overflow: 'hidden' }}>
      <Table.ScrollContainer minWidth={700}>
        <Table verticalSpacing="md" highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th style={{ width: 100 }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id} className="animate-fade-in">
                <Table.Td>
                  <Group gap="sm">
                    <Avatar src={user.avatar} size={40} radius="xl" />
                    <div>
                      <Text size="sm" fw={500}>
                        {user.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user.email}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Badge color={getRoleBadgeColor(user.role)} variant="light">
                    {user.role}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusBadgeColor(user.status)} variant="dot">
                    {user.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm" c="dimmed">
                    {format(user.createdAt, 'MMM d, yyyy')}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Tooltip label="Edit user">
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => onEdit(user)}
                      >
                        <IconEdit size={18} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete user">
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => onDelete(user)}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
}
