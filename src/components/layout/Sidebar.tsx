import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Box,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
  Divider,
  Badge,
  Tooltip,
  ActionIcon,
} from '@mantine/core';
import {
  IconLayoutDashboard,
  IconUsers,
  IconArrowsExchange,
  IconReportAnalytics,
  IconSettings,
  IconBuildingBank,
  IconChevronLeft,
  IconChevronRight,
  IconCreditCard,
  IconPigMoney,
} from '@tabler/icons-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: IconLayoutDashboard,
    path: '/dashboard',
    badge: null,
  },
  {
    label: 'Users',
    icon: IconUsers,
    path: '/',
    badge: null,
  },
  {
    label: 'Transactions',
    icon: IconArrowsExchange,
    path: '/transactions',
    badge: '12',
  },
  {
    label: 'Accounts',
    icon: IconCreditCard,
    path: '/accounts',
    badge: null,
  },
  {
    label: 'Investments',
    icon: IconPigMoney,
    path: '/investments',
    badge: null,
  },
  {
    label: 'Reports',
    icon: IconReportAnalytics,
    path: '/reports',
    badge: null,
  },
];

const bottomMenuItems = [
  {
    label: 'Settings',
    icon: IconSettings,
    path: '/settings',
    badge: null,
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  const renderNavItem = (item: typeof menuItems[0]) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    const content = (
      <NavLink
        component={Link}
        to={item.path}
        label={!collapsed ? item.label : undefined}
        leftSection={
          <ThemeIcon
            variant={isActive ? 'filled' : 'light'}
            color={isActive ? 'blue' : 'gray'}
            size={32}
            radius="md"
          >
            <Icon size={18} />
          </ThemeIcon>
        }
        rightSection={
          !collapsed && item.badge ? (
            <Badge size="sm" variant="filled" color="red" radius="xl">
              {item.badge}
            </Badge>
          ) : undefined
        }
        active={isActive}
        styles={{
          root: {
            borderRadius: '0.5rem',
            marginBottom: '0.25rem',
            backgroundColor: isActive ? 'var(--mantine-color-blue-light)' : 'transparent',
            '&:hover': {
              backgroundColor: isActive
                ? 'var(--mantine-color-blue-light)'
                : 'var(--mantine-color-gray-1)',
            },
          },
          label: {
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'var(--mantine-color-blue-7)' : 'var(--mantine-color-gray-7)',
          },
        }}
      />
    );

    if (collapsed) {
      return (
        <Tooltip label={item.label} position="right" withArrow key={item.path}>
          {content}
        </Tooltip>
      );
    }

    return <Box key={item.path}>{content}</Box>;
  };

  return (
    <Box
      style={{
        width: collapsed ? 80 : 260,
        minHeight: '100vh',
        background: 'linear-gradient(180deg, hsl(220 25% 10%) 0%, hsl(220 30% 8%) 100%)',
        borderRight: '1px solid hsl(220 20% 15%)',
        transition: 'width 0.2s ease',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Logo Section */}
      <Box
        py="lg"
        px="md"
        style={{
          borderBottom: '1px solid hsl(220 20% 15%)',
        }}
      >
        <Box
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <ThemeIcon
            size={42}
            radius="md"
            variant="gradient"
            gradient={{ from: 'blue.6', to: 'cyan.4', deg: 135 }}
          >
            <IconBuildingBank size={24} />
          </ThemeIcon>
          {!collapsed && (
            <Box>
              <Text fw={700} size="lg" c="white" style={{ lineHeight: 1.2 }}>
                FinanceHub
              </Text>
              <Text size="xs" c="dimmed">
                Enterprise Suite
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Toggle Button */}
      <ActionIcon
        variant="filled"
        color="gray"
        size="sm"
        radius="xl"
        onClick={onToggle}
        style={{
          position: 'absolute',
          right: -12,
          top: 72,
          zIndex: 100,
          border: '2px solid hsl(220 20% 15%)',
        }}
      >
        {collapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
      </ActionIcon>

      {/* Main Navigation */}
      <Box p="md" style={{ flex: 1 }}>
        {!collapsed && (
          <Text size="xs" c="dimmed" fw={600} mb="sm" tt="uppercase" pl="xs">
            Main Menu
          </Text>
        )}
        <Stack gap={4}>{menuItems.map(renderNavItem)}</Stack>
      </Box>

      {/* Bottom Navigation */}
      <Box p="md" style={{ borderTop: '1px solid hsl(220 20% 15%)' }}>
        {bottomMenuItems.map(renderNavItem)}
      </Box>
    </Box>
  );
}
