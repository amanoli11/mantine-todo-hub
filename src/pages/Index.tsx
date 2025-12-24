import { useState, useMemo } from 'react';
import {
  Container,
  Modal,
  Button,
  TextInput,
  Group,
  Paper,
  Text,
  Stack,
  Title,
  Box,
  SimpleGrid,
  ThemeIcon,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconPlus,
  IconSearch,
  IconCheck,
  IconX,
  IconUsers,
  IconUserCheck,
  IconUserX,
  IconShield,
} from '@tabler/icons-react';
import { UserTable } from '@/components/UserTable';
import { UserForm } from '@/components/UserForm';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/useUsers';
import { User, CreateUserInput } from '@/types/user';

const Index = () => {
  const [search, setSearch] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const lowerSearch = search.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch) ||
        user.role.toLowerCase().includes(lowerSearch)
    );
  }, [users, search]);

  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'Active').length;
    const inactive = users.filter((u) => u.status === 'Inactive').length;
    const admins = users.filter((u) => u.role === 'Admin').length;
    return { total, active, inactive, admins };
  }, [users]);

  const handleOpenModal = (user?: User) => {
    setSelectedUser(user || null);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setSelectedUser(null);
  };

  const handleSubmit = async (data: CreateUserInput) => {
    try {
      if (selectedUser) {
        await updateUser.mutateAsync({ id: selectedUser.id, input: data });
        notifications.show({
          title: 'Success',
          message: 'User updated successfully',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
      } else {
        await createUser.mutateAsync(data);
        notifications.show({
          title: 'Success',
          message: 'User created successfully',
          color: 'green',
          icon: <IconCheck size={18} />,
        });
      }
      handleCloseModal();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Something went wrong',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  };

  const handleOpenDeleteModal = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpened(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpened(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser.mutateAsync(selectedUser.id);
      notifications.show({
        title: 'Success',
        message: 'User deleted successfully',
        color: 'green',
        icon: <IconCheck size={18} />,
      });
      handleCloseDeleteModal();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete user',
        color: 'red',
        icon: <IconX size={18} />,
      });
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats.total,
      icon: IconUsers,
      color: 'blue',
      gradient: { from: 'blue.5', to: 'cyan.5' },
    },
    {
      label: 'Active Users',
      value: stats.active,
      icon: IconUserCheck,
      color: 'green',
      gradient: { from: 'green.5', to: 'teal.5' },
    },
    {
      label: 'Inactive Users',
      value: stats.inactive,
      icon: IconUserX,
      color: 'orange',
      gradient: { from: 'orange.5', to: 'yellow.5' },
    },
    {
      label: 'Administrators',
      value: stats.admins,
      icon: IconShield,
      color: 'violet',
      gradient: { from: 'violet.5', to: 'grape.5' },
    },
  ];

  return (
    <Box p="xl">
      {/* Page Header */}
      <Box mb="xl">
        <Title order={2} fw={700} mb={4}>
          User Management
        </Title>
        <Text c="dimmed">Manage team members and their access permissions</Text>
      </Box>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        {statCards.map((stat) => (
          <Paper
            key={stat.label}
            p="lg"
            radius="md"
            withBorder
            style={{
              borderColor: 'hsl(220 13% 91%)',
              background: 'white',
            }}
          >
            <Group justify="space-between" align="flex-start">
              <Box>
                <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                  {stat.label}
                </Text>
                <Text size="xl" fw={700}>
                  {stat.value}
                </Text>
              </Box>
              <ThemeIcon
                size={48}
                radius="md"
                variant="gradient"
                gradient={stat.gradient}
              >
                <stat.icon size={24} />
              </ThemeIcon>
            </Group>
          </Paper>
        ))}
      </SimpleGrid>

      {/* Search and Actions */}
      <Paper p="md" radius="md" withBorder mb="lg" bg="white">
        <Group justify="space-between" wrap="wrap" gap="md">
          <TextInput
            placeholder="Search users by name, email, or role..."
            leftSection={<IconSearch size={18} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 250, maxWidth: 400 }}
            radius="md"
          />
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => handleOpenModal()}
            radius="md"
            variant="gradient"
            gradient={{ from: 'blue.6', to: 'cyan.5', deg: 135 }}
          >
            Add User
          </Button>
        </Group>
      </Paper>

      {/* User Table */}
      <Stack gap="md">
        <Group justify="space-between">
          <Text c="dimmed" size="sm">
            Showing {filteredUsers.length} of {users.length} users
          </Text>
        </Group>

        <UserTable
          users={filteredUsers}
          isLoading={isLoading}
          onEdit={handleOpenModal}
          onDelete={handleOpenDeleteModal}
        />
      </Stack>

      {/* Create/Edit Modal */}
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={selectedUser ? 'Edit User' : 'Create New User'}
        centered
        radius="md"
        size="md"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createUser.isPending || updateUser.isPending}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        isLoading={deleteUser.isPending}
      />
    </Box>
  );
};

export default Index;
