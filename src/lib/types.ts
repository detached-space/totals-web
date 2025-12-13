export interface Transaction {
    amount: number; // required
    reference: string; // required
    creditor?: string;
    time?: string; // ISO string
    status?: 'PENDING' | 'CLEARED' | 'SYNCED' | string;
    currentBalance?: string;
    bankId?: number;
    type?: 'CREDIT' | 'DEBIT' | string;
    transactionLink?: string;
    accountNumber?: string; // Last 4 digits
}
