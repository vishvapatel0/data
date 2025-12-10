export interface User {
  id: number;
  email: string;
  password: string;
  fullName: string;
  tenantId: string;
  role: string;
}

export const users: User[] = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2a$10$rQZ8K9Y5YkZ1234567890uJ1234567890123456789012345678', // admin123
    fullName: 'Admin User',
    tenantId: 'tenant-001',
    role: 'admin',
  },
  {
    id: 2,
    email: 'user1@example.com',
    password: '$2a$10$rQZ8K9Y5YkZ1234567890uJ1234567890123456789012345678', // user123
    fullName: 'Regular User',
    tenantId: 'tenant-001',
    role: 'user',
  },
  {
    id: 3,
    email: 'attacker@example.com',
    password: '$2a$10$rQZ8K9Y5YkZ1234567890uJ1234567890123456789012345678', // attacker123
    fullName: 'Attacker User',
    tenantId: 'tenant-002',
    role: 'user',
  },
];
