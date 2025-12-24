import { useEffect } from 'react';
import { TextInput, Select, Button, Stack, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { User, CreateUserInput } from '@/types/user';

interface UserFormProps {
  user?: User | null;
  onSubmit: (data: CreateUserInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || 'User',
      status: user?.status || 'Active',
    },
  });

  useEffect(() => {
    if (user) {
      form.setValues({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form.values as CreateUserInput);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="Enter full name"
          required
          value={form.values.name}
          onChange={(e) => form.setFieldValue('name', e.currentTarget.value)}
          styles={{
            input: {
              borderRadius: '0.5rem',
            },
          }}
        />

        <TextInput
          label="Email"
          placeholder="Enter email address"
          type="email"
          required
          value={form.values.email}
          onChange={(e) => form.setFieldValue('email', e.currentTarget.value)}
          styles={{
            input: {
              borderRadius: '0.5rem',
            },
          }}
        />

        <Select
          label="Role"
          placeholder="Select role"
          required
          value={form.values.role}
          onChange={(value) => form.setFieldValue('role', (value || 'User') as 'Admin' | 'Editor' | 'User')}
          data={[
            { value: 'Admin', label: 'Admin' },
            { value: 'Editor', label: 'Editor' },
            { value: 'User', label: 'User' },
          ]}
          styles={{
            input: {
              borderRadius: '0.5rem',
            },
          }}
        />

        <Select
          label="Status"
          placeholder="Select status"
          required
          value={form.values.status}
          onChange={(value) => form.setFieldValue('status', (value || 'Active') as 'Active' | 'Inactive')}
          data={[
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
          styles={{
            input: {
              borderRadius: '0.5rem',
            },
          }}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading}>
            {user ? 'Update User' : 'Create User'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
