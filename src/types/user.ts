export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Editor';
  status: 'Active' | 'Inactive';
  avatar: string;
  createdAt: Date;
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'avatar'>;
export type UpdateUserInput = Partial<CreateUserInput>;
