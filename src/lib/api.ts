const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8080/api';

export interface ApiAccount {
    accountNumber: string;
    bank: number;
    bankName: string;
    bankShortName: string;
    bankImage: string;
    balance: number;
    accountHolderName: string;
    settledBalance: number | null;
    pendingCredit: number | null;
}

export interface ApiSummary {
    totalBalance: number;
    totalSettledBalance: number;
    totalPendingCredit: number;
    totalCredit: number;
    totalDebit: number;
    accountCount: number;
    bankCount: number;
    transactionCount: number;
}

export interface ApiTransaction {
    amount: number;
    reference: string;
    creditor: string | null;
    receiver: string | null;
    note: string | null;
    time: string | null;
    status: string | null;
    currentBalance: string | null;
    serviceCharge: number | null;
    vat: number | null;
    bankId: number | null;
    bankName: string;
    bankFullName: string;
    bankImage: string;
    type: string;
    transactionLink: string | null;
    accountNumber: string | null;
    categoryId: number | null;
}

export interface ApiTransactionsResponse {
    data: ApiTransaction[];
    total: number;
    limit: number;
    offset: number;
}

export interface ApiCategory {
    id: number;
    name: string;
    essential: boolean;
    uncategorized: boolean;
    iconKey: string;
    colorKey: string;
    flow: string;
    typeLabel: string;
}

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await fetch(`${BASE_URL}${path}${qs}`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
}

export interface ApiTransactionStats {
    byAccount: {
        bankId: number;
        name: string;
        bankName: string;
        volume: number;
        count: number;
    }[];
    totals: {
        totalVolume: number;
        totalCount: number;
    };
}

export const api = {
    summary: () => get<ApiSummary>('/summary'),
    accounts: () => get<ApiAccount[]>('/accounts'),
    transactions: (params?: Record<string, string>) =>
        get<ApiTransactionsResponse>('/transactions', params),
    transactionStats: () => get<ApiTransactionStats>('/transactions/stats'),
    categories: () => get<ApiCategory[]>('/categories'),
};

export const categoryColorMap: Record<string, string> = {
    red: '#EF4444',
    blue: '#60a5fa',
    yellow: '#fbbf24',
    purple: '#a78bfa',
    green: '#34d399',
    orange: '#fb923c',
    pink: '#f472b6',
    teal: '#2dd4bf',
    cyan: '#22d3ee',
    indigo: '#818cf8',
    emerald: '#10b981',
    amber: '#f59e0b',
    rose: '#fb7185',
    violet: '#8b5cf6',
    sky: '#0ea5e9',
    lime: '#84cc16',
};
