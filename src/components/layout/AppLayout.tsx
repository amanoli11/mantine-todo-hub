import { AppShell, Box, Burger, Group, rem, ScrollArea } from "@mantine/core";
import { NavbarSearch } from "./Sidebar";
import { useDisclosure } from "@mantine/hooks";
import { Topbar } from "./Topbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      layout="alt"
      withBorder={false}
      header={{ height: 60, offset: false }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: false },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Topbar />
      </AppShell.Header>

      <NavbarSearch />

      <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
