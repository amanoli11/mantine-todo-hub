import {
  Box,
  Group,
  Text,
  TextInput,
  ActionIcon,
  Avatar,
  Menu,
  Badge,
  Indicator,
  Divider,
  Typography,
  Title,
} from "@mantine/core";
import {
  IconSearch,
  IconBell,
  IconSettings,
  IconLogout,
  IconUser,
  IconMoon,
  IconHelp,
} from "@tabler/icons-react";

export function Topbar() {
  return (
    <Box
      py="sm"
      px="lg"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Group justify="space-between">
        {/* <Box style={{ flex: 1, maxWidth: 400 }}>
          <TextInput
            placeholder="Search transactions, users..."
            leftSection={<IconSearch size={18} />}
            radius="md"
          />
        </Box> */}
        <Title order={2}>Microcode Microfinance</Title>

        <Group gap="md">
          {/* <Box
            px="md"
            style={{
              background:
                "linear-gradient(135deg, hsl(142 70% 45% / 0.1) 0%, hsl(142 70% 45% / 0.05) 100%)",
              borderRadius: "0.5rem",
              border: "1px solid hsl(142 70% 45% / 0.2)",
            }}
          >
            <Text size="xs" c="dimmed" fw={500}>
              Portfolio Value
            </Text>
            <Text size="sm" fw={700} c="green.7">
              $1,234,567.89
            </Text>
          </Box> */}

          {/* Notifications */}
          <Menu shadow="lg" width={300} position="bottom-end" radius="md">
            <Menu.Target>
              <Indicator color="red" size={8} offset={4} processing>
                <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
                  <IconBell size={20} />
                </ActionIcon>
              </Indicator>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Notifications</Menu.Label>
              <Menu.Item
                leftSection={
                  <Box
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "var(--mantine-color-blue-6)",
                    }}
                  />
                }
              >
                <Text size="sm" fw={500}>
                  New transaction received
                </Text>
                <Text size="xs" c="dimmed">
                  2 minutes ago
                </Text>
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <Box
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "var(--mantine-color-green-6)",
                    }}
                  />
                }
              >
                <Text size="sm" fw={500}>
                  Account verified
                </Text>
                <Text size="xs" c="dimmed">
                  1 hour ago
                </Text>
              </Menu.Item>
              <Divider my="xs" />
              <Menu.Item ta="center" c="blue">
                View all notifications
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          {/* Help */}
          <ActionIcon variant="subtle" color="gray" size="lg" radius="md">
            <IconHelp size={20} />
          </ActionIcon>

          {/* User Menu */}
          <Menu shadow="lg" width={200} position="bottom-end" radius="md">
            <Menu.Target>
              <Group
                gap="xs"
                style={{
                  cursor: "pointer",
                  padding: "0.25rem 0.5rem 0.25rem 0.25rem",
                  borderRadius: "0.5rem",
                  transition: "background 0.2s",
                  "&:hover": {
                    background: "hsl(220 14% 96%)",
                  },
                }}
              >
                <Avatar
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                  size={36}
                  radius="md"
                />
                <Box style={{ display: "none" }} visibleFrom="sm">
                  <Text size="sm" fw={500} style={{ lineHeight: 1.2 }}>
                    Alex Johnson
                  </Text>
                  <Badge size="xs" variant="light" color="blue">
                    Admin
                  </Badge>
                </Box>
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Account</Menu.Label>
              <Menu.Item leftSection={<IconUser size={16} />}>
                Profile
              </Menu.Item>
              <Menu.Item leftSection={<IconSettings size={16} />}>
                Settings
              </Menu.Item>
              <Menu.Item leftSection={<IconMoon size={16} />}>
                Dark Mode
              </Menu.Item>
              <Divider my="xs" />
              <Menu.Item leftSection={<IconLogout size={16} />} color="red">
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </Box>
  );
}
