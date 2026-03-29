export interface Transaction {
    amount: number;
    reference: string;
    creditor?: string;
    time?: string;
    status?: 'PENDING' | 'CLEARED' | 'SYNCED' | string;
    currentBalance?: string;
    bankId?: number;
    type?: 'CREDIT' | 'DEBIT' | string;
    transactionLink?: string;
    accountNumber?: string;
}

export interface Account {
    id: number;
    name: string;
    balance: number;
    accountNumber: string;
}

export interface Person {
    rank: number;
    name: string;
    amount: string;
    initials: string;
    color: string;
    bg: string;
    lastTransaction?: string;
    date?: string;
}

export interface SpendingCategory {
    name: string;
    value: number;
    color: string;
}

export interface NetWorthDataPoint {
    month: string;
    value: number;
}

export interface ActivityItem {
    id: number;
    type: 'transaction' | 'account' | 'milestone';
    title: string;
    description: string;
    timestamp: string;
    amount?: number;
    accountId?: number;
}

export interface Budget {
    id: number;
    name: string;
    type: string;
    amount: number;
    categoryId?: number;
    categoryIds?: number[];
    startDate: string;
    endDate?: string | null;
    isActive: boolean;
    categories?: Array<{ id: number; name: string; }>;
    status?: {
        spent: number;
        remaining: number;
        percentageUsed: number;
        isExceeded: boolean;
        isApproachingLimit: boolean;
    };
    // Legacy mock data properties
    category?: string;
    budgeted?: number;
    spent?: number;
    color?: string;
    icon?: string;
}

export interface Goal {
    id: number;
    title: string;
    target: number;
    current: number;
    icon: string;
    color: string;
}
