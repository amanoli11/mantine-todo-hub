import { Group, Title, Text, Box, ThemeIcon } from '@mantine/core';
import { IconUsers } from '@tabler/icons-react';

export function Header() {
  return (
    <Box
      py="xl"
      px="md"
      style={{
        background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(262 83% 58%) 100%)',
        borderRadius: '0.75rem',
        marginBottom: '2rem',
      }}
    >
      <Group justify="center">
        <ThemeIcon
          size={50}
          radius="xl"
          variant="white"
          color="blue"
        >
          <IconUsers size={28} />
        </ThemeIcon>
        <div>
          <Title order={1} c="white" fw={700}>
            User Management
          </Title>
          <Text c="white" opacity={0.9} size="sm">
            Manage your team members and their permissions
          </Text>
        </div>
      </Group>
    </Box>
  );
}
