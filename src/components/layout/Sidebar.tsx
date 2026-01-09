import {
  IconCoinEuroFilled,
  IconDashboard,
  IconDashboardFilled,
  IconFileText,
  IconHome,
  IconLibraryFilled,
  IconPlus,
  IconSearch,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";
import {
  ActionIcon,
  AppShell,
  Badge,
  Box,
  Code,
  Group,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { UserButton } from "../UserButton/UserButton";
import classes from "./NavbarSearch.module.css";
import { useNavigate } from "react-router-dom";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import "@mantine/spotlight/styles.css";

const links = [
  { icon: IconDashboardFilled, label: "Dashboard", notifications: 7, path: "" },
  { icon: IconUserFilled, label: "Users", notifications: 3, path: "users" },
  {
    icon: IconCoinEuroFilled,
    label: "Transaction",
    notifications: 4,
    path: "transactions",
  },
  { icon: IconLibraryFilled, label: "Accounts", path: "accounts" },
];

const collections = [
  { emoji: "👍", label: "Sales" },
  { emoji: "🚚", label: "Deliveries" },
  { emoji: "💸", label: "Discounts" },
  { emoji: "💰", label: "Profits" },
  { emoji: "✨", label: "Reports" },
  { emoji: "🛒", label: "Orders" },
  { emoji: "📅", label: "Events" },
  { emoji: "🙈", label: "Debts" },
  { emoji: "💁‍♀️", label: "Customers" },
];

export function NavbarSearch() {
  const navigate = useNavigate();
  const mainLinks = links.map((link) => (
    <UnstyledButton
      key={link.label}
      className={classes.mainLink}
      onClick={() => {
        navigate(link.path);
      }}
    >
      <div className={classes.mainLinkInner}>
        <link.icon size={20} className={classes.mainLinkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </div>
      {link.notifications && (
        <Badge size="sm" variant="filled" className={classes.mainLinkBadge}>
          {link.notifications}
        </Badge>
      )}
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection) => (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      key={collection.label}
      className={classes.collectionLink}
    >
      <Box component="span" mr={9} fz={16}>
        {collection.emoji}
      </Box>
      {collection.label}
    </a>
  ));

  const actions: SpotlightActionData[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      description: "Bla bla bla bla bla bla bla",
      leftSection: <IconDashboardFilled size={24} stroke={1.5} />,
      onClick: () => navigate(""),
    },
    {
      id: "users",
      label: "Users",
      description: "Bla bla bla bla bla bla bla",
      leftSection: <IconUserFilled size={24} stroke={1.5} />,
      onClick: () => navigate("users"),
    },
    {
      id: "transaction",
      label: "Transaction",
      description: "Bla bla bla bla bla bla bla",
      leftSection: <IconCoinEuroFilled size={24} stroke={1.5} />,
      onClick: () => navigate("transactions"),
    },
    {
      id: "accounts",
      label: "Accounts",
      description: "Bla bla bla bla bla bla bla",
      leftSection: <IconLibraryFilled size={24} stroke={1.5} />,
      onClick: () => navigate("accounts"),
    },
  ];

  return (
    <AppShell.Navbar className={classes.navbar}>
      <AppShell.Section className={classes.section}>
        <UserButton />
      </AppShell.Section>

      <Spotlight
        actions={actions}
        nothingFound="Nothing found..."
        highlightQuery
        searchProps={{
          leftSection: <IconSearch size={20} stroke={1.5} />,
          placeholder: "Search...",
        }}
      />

      <TextInput
        readOnly
        onClick={() => {
          spotlight.open();
        }}
        placeholder="Search"
        size="xs"
        leftSection={<IconSearch size={12} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={classes.searchCode}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
      />

      <AppShell.Section className={classes.section}>
        <div className={classes.mainLinks}>{mainLinks}</div>
      </AppShell.Section>

      <div className={classes.section}>
        <Group className={classes.collectionsHeader} justify="space-between">
          <Text size="xs" fw={500} c="dimmed">
            Collections
          </Text>
          <Tooltip label="Create collection" withArrow position="right">
            <ActionIcon variant="default" size={18}>
              <IconPlus size={12} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </Group>
        <div className={classes.collections}>{collectionLinks}</div>
      </div>
    </AppShell.Navbar>
  );
}
