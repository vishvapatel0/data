export interface Document {
  id: number;
  title: string;
  content: string;
  tenantId: string;
  tenantName: string;
  ownerId: number;
  isConfidential: boolean;
  createdAt: Date;
}

export const documents: Document[] = [
  {
    id: 1,
    title: 'Q4 Financial Report',
    content: 'Confidential financial data for Q4 2024...',
    tenantId: 'tenant-001',
    tenantName: 'Acme Corp',
    ownerId: 1,
    isConfidential: true,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Employee Handbook',
    content: 'Company policies and procedures...',
    tenantId: 'tenant-001',
    tenantName: 'Acme Corp',
    ownerId: 2,
    isConfidential: false,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: 3,
    title: 'Strategic Plan 2025',
    content: 'Competitive analysis and market strategy...',
    tenantId: 'tenant-002',
    tenantName: 'Beta Inc',
    ownerId: 3,
    isConfidential: true,
    createdAt: new Date('2024-01-12'),
  },
];
