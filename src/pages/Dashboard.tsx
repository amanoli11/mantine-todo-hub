import { Paper, Title, Text, Box, Group, Stack, Badge, SimpleGrid } from '@mantine/core';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { IconTrendingUp, IconTrendingDown, IconArrowUpRight } from '@tabler/icons-react';

// Portfolio performance data (12 months)
const portfolioData = [
  { month: 'Jan', value: 125000, benchmark: 120000 },
  { month: 'Feb', value: 132000, benchmark: 123000 },
  { month: 'Mar', value: 128000, benchmark: 125000 },
  { month: 'Apr', value: 142000, benchmark: 130000 },
  { month: 'May', value: 155000, benchmark: 135000 },
  { month: 'Jun', value: 148000, benchmark: 138000 },
  { month: 'Jul', value: 162000, benchmark: 142000 },
  { month: 'Aug', value: 175000, benchmark: 148000 },
  { month: 'Sep', value: 168000, benchmark: 152000 },
  { month: 'Oct', value: 182000, benchmark: 158000 },
  { month: 'Nov', value: 195000, benchmark: 165000 },
  { month: 'Dec', value: 210000, benchmark: 172000 },
];

// Transaction history data
const transactionData = [
  { day: 'Mon', deposits: 4500, withdrawals: 2100 },
  { day: 'Tue', deposits: 3200, withdrawals: 1800 },
  { day: 'Wed', deposits: 5800, withdrawals: 3200 },
  { day: 'Thu', deposits: 2900, withdrawals: 1400 },
  { day: 'Fri', deposits: 6200, withdrawals: 2800 },
  { day: 'Sat', deposits: 1800, withdrawals: 900 },
  { day: 'Sun', deposits: 1200, withdrawals: 600 },
];

// Asset allocation data
const assetAllocationData = [
  { name: 'Stocks', value: 45, color: 'hsl(217 91% 60%)' },
  { name: 'Bonds', value: 25, color: 'hsl(142 76% 36%)' },
  { name: 'Real Estate', value: 15, color: 'hsl(38 92% 50%)' },
  { name: 'Crypto', value: 10, color: 'hsl(280 67% 54%)' },
  { name: 'Cash', value: 5, color: 'hsl(220 14% 50%)' },
];

// Monthly returns data
const monthlyReturnsData = [
  { month: 'Jan', return: 5.2 },
  { month: 'Feb', return: 3.8 },
  { month: 'Mar', return: -2.1 },
  { month: 'Apr', return: 8.5 },
  { month: 'May', return: 6.2 },
  { month: 'Jun', return: -1.5 },
  { month: 'Jul', return: 7.8 },
  { month: 'Aug', return: 4.2 },
  { month: 'Sep', return: -3.2 },
  { month: 'Oct', return: 5.9 },
  { month: 'Nov', return: 6.8 },
  { month: 'Dec', return: 7.2 },
];

const StatCard = ({
  title,
  value,
  change,
  trend,
}: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}) => (
  <Paper p="lg" radius="md" withBorder>
    <Text size="sm" c="dimmed" fw={500}>
      {title}
    </Text>
    <Group justify="space-between" align="flex-end" mt="xs">
      <Text size="xl" fw={700}>
        {value}
      </Text>
      <Badge
        color={trend === 'up' ? 'green' : 'red'}
        variant="light"
        leftSection={
          trend === 'up' ? <IconTrendingUp size={12} /> : <IconTrendingDown size={12} />
        }
      >
        {change}
      </Badge>
    </Group>
  </Paper>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper p="sm" radius="sm" shadow="md" withBorder>
        <Text size="sm" fw={600}>
          {label}
        </Text>
        {payload.map((entry: any, index: number) => (
          <Text key={index} size="xs" c={entry.color}>
            {entry.name}: ${entry.value.toLocaleString()}
          </Text>
        ))}
      </Paper>
    );
  }
  return null;
};

export default function Dashboard() {
  return (
    <Box>
      <Group justify="space-between" align="center" mb="xl">
        <Box>
          <Title order={2} fw={700}>
            Dashboard
          </Title>
          <Text c="dimmed" size="sm">
            Overview of your financial portfolio
          </Text>
        </Box>
        <Badge
          size="lg"
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
          leftSection={<IconArrowUpRight size={14} />}
        >
          +18.5% YTD
        </Badge>
      </Group>

      {/* Stats Row */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        <StatCard title="Total Portfolio Value" value="$210,000" change="+12.4%" trend="up" />
        <StatCard title="Monthly Return" value="$14,200" change="+7.2%" trend="up" />
        <StatCard title="Total Investments" value="$185,000" change="+15.8%" trend="up" />
        <StatCard title="Cash Balance" value="$25,000" change="-2.1%" trend="down" />
      </SimpleGrid>

      {/* Charts Grid */}
      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg" mb="lg">
        {/* Portfolio Performance Chart */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Box>
              <Text fw={600} size="lg">
                Portfolio Performance
              </Text>
              <Text size="xs" c="dimmed">
                vs. Market Benchmark
              </Text>
            </Box>
            <Badge variant="light" color="blue">
              12 Months
            </Badge>
          </Group>
          <Box h={280}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220 14% 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(220 14% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220 14% 50%)" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(220 14% 50%)"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  name="Portfolio"
                  stroke="hsl(217 91% 60%)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
                <Area
                  type="monotone"
                  dataKey="benchmark"
                  name="Benchmark"
                  stroke="hsl(220 14% 50%)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorBenchmark)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Transaction History Chart */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Box>
              <Text fw={600} size="lg">
                Transaction History
              </Text>
              <Text size="xs" c="dimmed">
                Deposits vs Withdrawals
              </Text>
            </Box>
            <Badge variant="light" color="green">
              This Week
            </Badge>
          </Group>
          <Box h={280}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionData} barGap={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 90%)" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220 14% 50%)" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(220 14% 50%)"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="deposits" name="Deposits" fill="hsl(142 76% 36%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="withdrawals" name="Withdrawals" fill="hsl(0 84% 60%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
        {/* Asset Allocation Pie Chart */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Box>
              <Text fw={600} size="lg">
                Asset Allocation
              </Text>
              <Text size="xs" c="dimmed">
                Current portfolio distribution
              </Text>
            </Box>
          </Group>
          <Box h={280}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetAllocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: 'hsl(220 14% 50%)' }}
                >
                  {assetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid hsl(220 14% 90%)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Monthly Returns Chart */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Box>
              <Text fw={600} size="lg">
                Monthly Returns
              </Text>
              <Text size="xs" c="dimmed">
                Percentage return by month
              </Text>
            </Box>
            <Badge variant="light" color="blue">
              2024
            </Badge>
          </Group>
          <Box h={280}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyReturnsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 90%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220 14% 50%)" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="hsl(220 14% 50%)"
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Return']}
                  contentStyle={{
                    background: 'white',
                    border: '1px solid hsl(220 14% 90%)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="return"
                  stroke="hsl(217 91% 60%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(217 91% 60%)', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: 'hsl(217 91% 60%)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </SimpleGrid>
    </Box>
  );
}
