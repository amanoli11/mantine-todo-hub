import { User, CreateUserInput, UpdateUserInput } from '@/types/user';

// Simulated database with localStorage persistence
const STORAGE_KEY = 'users_data';

const generateAvatar = (name: string) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=228be6`;
};

const getInitialUsers = (): User[] => [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    status: 'Active',
    avatar: generateAvatar('John Doe'),
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'Editor',
    status: 'Active',
    avatar: generateAvatar('Jane Smith'),
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    role: 'User',
    status: 'Inactive',
    avatar: generateAvatar('Mike Johnson'),
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    role: 'User',
    status: 'Active',
    avatar: generateAvatar('Sarah Williams'),
    createdAt: new Date('2024-04-05'),
  },
  {
    id: '5',
    name: 'Tom Brown',
    email: 'tom.brown@example.com',
    role: 'Editor',
    status: 'Active',
    avatar: generateAvatar('Tom Brown'),
    createdAt: new Date('2024-05-12'),
  },
];

const loadUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((u: User) => ({
        ...u,
        createdAt: new Date(u.createdAt),
      }));
    }
  } catch (e) {
    console.error('Error loading users:', e);
  }
  const initial = getInitialUsers();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userApi = {
  getAll: async (): Promise<User[]> => {
    await delay(300);
    return loadUsers();
  },

  getById: async (id: string): Promise<User | undefined> => {
    await delay(200);
    const users = loadUsers();
    return users.find((u) => u.id === id);
  },

  create: async (input: CreateUserInput): Promise<User> => {
    await delay(400);
    const users = loadUsers();
    const newUser: User = {
      ...input,
      id: crypto.randomUUID(),
      avatar: generateAvatar(input.name),
      createdAt: new Date(),
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
  },

  update: async (id: string, input: UpdateUserInput): Promise<User> => {
    await delay(400);
    const users = loadUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    
    const updated = {
      ...users[index],
      ...input,
      avatar: input.name ? generateAvatar(input.name) : users[index].avatar,
    };
    users[index] = updated;
    saveUsers(users);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const users = loadUsers();
    const filtered = users.filter((u) => u.id !== id);
    saveUsers(filtered);
  },
};
