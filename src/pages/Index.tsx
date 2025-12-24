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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconSearch, IconCheck, IconX } from '@tabler/icons-react';
import { Header } from '@/components/Header';
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

  return (
    <Container size="lg" py="xl">
      <Header />

      <Paper p="md" radius="md" withBorder mb="xl">
        <Group justify="space-between" wrap="wrap" gap="md">
          <TextInput
            placeholder="Search users..."
            leftSection={<IconSearch size={18} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1, minWidth: 200 }}
            styles={{
              input: {
                borderRadius: '0.5rem',
              },
            }}
          />
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={() => handleOpenModal()}
            radius="md"
          >
            Add User
          </Button>
        </Group>
      </Paper>

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

      <DeleteConfirmModal
        opened={deleteModalOpened}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        isLoading={deleteUser.isPending}
      />
    </Container>
  );
};

export default Index;
