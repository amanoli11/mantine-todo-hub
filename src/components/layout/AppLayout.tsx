import { useState } from "react";
import { Box } from "@mantine/core";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "hsl(220 14% 96%)",
          minWidth: 0,
        }}
      >
        <Topbar />
        <Box
          p="lg"
          component="main"
          style={{
            flex: 1,
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
