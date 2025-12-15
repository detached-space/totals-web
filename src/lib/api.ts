import type {
  Transaction,
  Account,
  BankSummary,
  AccountSummary,
  AllSummary,
  DashboardData,
} from "./types";

// Use the current window location (where Vite app is running) and append /api
const API_BASE_URL = `${window.location.origin}/api`;

// Extract base URL (host and port) for endpoints outside /api
const API_HOST = window.location.origin;

// Helper function to handle API errors
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: true,
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

// API Response Types
interface ApiAccount {
  accountNumber: string;
  bank: number;
  bankName: string;
  bankShortName: string;
  bankImage: string;
  balance: number;
  accountHolderName: string;
  settledBalance: number;
  pendingCredit: number;
}

interface ApiTransaction {
  amount: number;
  reference: string;
  creditor?: string;
  receiver?: string;
  time: string;
  status: "PENDING" | "CLEARED" | "SYNCED";
  currentBalance: string;
  bankId: number;
  bankName: string;
  bankFullName: string;
  bankImage: string;
  type: "CREDIT" | "DEBIT";
  transactionLink?: string;
  accountNumber: string;
}

interface ApiSummary {
  totalBalance: number;
  totalSettledBalance: number;
  totalPendingCredit: number;
  totalCredit: number;
  totalDebit: number;
  accountCount: number;
  bankCount: number;
  transactionCount: number;
}

interface ApiSummaryByBank {
  bankId: number;
  bankName: string;
  bankShortName: string;
  bankImage: string;
  totalBalance: number;
  settledBalance: number;
  pendingCredit: number;
  totalCredit: number;
  totalDebit: number;
  accountCount: number;
  transactionCount: number;
}

interface ApiSummaryByAccount {
  accountNumber: string;
  accountHolderName: string;
  bankId: number;
  bankName: string;
  bankShortName: string;
  bankImage: string;
  balance: number;
  settledBalance: number;
  pendingCredit: number;
  totalCredit: number;
  totalDebit: number;
  transactionCount: number;
}

interface ApiBank {
  id: number;
  name: string;
  shortName: string;
  codes: string[];
  image: string;
}

interface TransactionsResponse {
  data: ApiTransaction[];
  total: number;
  limit: number;
  offset: number;
}

// Transform API account to app account
function transformAccount(apiAccount: ApiAccount): Account {
  return {
    accountNumber: apiAccount.accountNumber,
    bank: apiAccount.bank,
    balance: apiAccount.balance,
    accountHolderName: apiAccount.accountHolderName,
    settledBalance: apiAccount.settledBalance,
    pendingCredit: apiAccount.pendingCredit,
  };
}

// Transform API transaction to app transaction
function transformTransaction(apiTransaction: ApiTransaction): Transaction {
  return {
    amount: apiTransaction.amount,
    reference: apiTransaction.reference,
    creditor: apiTransaction.creditor,
    receiver: apiTransaction.receiver,
    time: apiTransaction.time,
    status: apiTransaction.status,
    currentBalance: apiTransaction.currentBalance,
    bankId: apiTransaction.bankId,
    type: apiTransaction.type,
    transactionLink: apiTransaction.transactionLink,
    accountNumber: apiTransaction.accountNumber,
    id: `${apiTransaction.bankId}-${apiTransaction.accountNumber}-${apiTransaction.reference}-${apiTransaction.time}`,
    currency: "ETB",
  };
}

// Transform API summary by bank to app bank summary
function transformBankSummary(apiSummary: ApiSummaryByBank): BankSummary {
  return {
    bankId: apiSummary.bankId,
    totalCredit: apiSummary.totalCredit,
    totalDebit: apiSummary.totalDebit,
    settledBalance: apiSummary.settledBalance,
    pendingCredit: apiSummary.pendingCredit,
    totalBalance: apiSummary.totalBalance,
    accountCount: apiSummary.accountCount,
  };
}

// Transform API summary by account to app account summary
function transformAccountSummary(
  apiSummary: ApiSummaryByAccount
): AccountSummary {
  return {
    bankId: apiSummary.bankId,
    accountNumber: apiSummary.accountNumber,
    accountHolderName: apiSummary.accountHolderName,
    totalTransactions: apiSummary.transactionCount,
    totalCredit: apiSummary.totalCredit,
    totalDebit: apiSummary.totalDebit,
    settledBalance: apiSummary.settledBalance,
    pendingCredit: apiSummary.pendingCredit,
    balance: apiSummary.balance,
  };
}

// API Functions
export async function fetchAccounts(): Promise<Account[]> {
  const response = await fetch(`${API_BASE_URL}/accounts`);
  const data: ApiAccount[] = await handleResponse(response);
  return data.map(transformAccount);
}

export async function fetchAccount(
  bankId: number,
  accountNumber: string
): Promise<Account> {
  const response = await fetch(
    `${API_BASE_URL}/accounts/${bankId}/${accountNumber}`
  );
  const data: ApiAccount = await handleResponse(response);
  return transformAccount(data);
}

export interface TransactionFilters {
  bankId?: number;
  type?: "CREDIT" | "DEBIT";
  status?: "PENDING" | "CLEARED" | "SYNCED";
  limit?: number;
  offset?: number;
  from?: string; // ISO 8601 format
  to?: string; // ISO 8601 format
}

export async function fetchTransactions(
  filters?: TransactionFilters
): Promise<{ transactions: Transaction[]; total: number }> {
  const params = new URLSearchParams();
  if (filters?.bankId) params.append("bankId", filters.bankId.toString());
  if (filters?.type) params.append("type", filters.type);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.offset) params.append("offset", filters.offset.toString());
  if (filters?.from) params.append("from", filters.from);
  if (filters?.to) params.append("to", filters.to);

  const url = `${API_BASE_URL}/transactions${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const response = await fetch(url);
  const data: TransactionsResponse = await handleResponse(response);
  return {
    transactions: data.data.map(transformTransaction),
    total: data.total,
  };
}

export async function fetchSummary(): Promise<AllSummary> {
  const response = await fetch(`${API_BASE_URL}/summary`);
  const data: ApiSummary = await handleResponse(response);
  return {
    totalCredit: data.totalCredit,
    totalDebit: data.totalDebit,
    banks: data.bankCount,
    accounts: data.accountCount,
    totalBalance: data.totalBalance,
  };
}

export async function fetchSummaryByBank(): Promise<BankSummary[]> {
  const response = await fetch(`${API_BASE_URL}/summary/by-bank`);
  const data: ApiSummaryByBank[] = await handleResponse(response);
  return data.map(transformBankSummary);
}

export async function fetchSummaryByAccount(): Promise<AccountSummary[]> {
  const response = await fetch(`${API_BASE_URL}/summary/by-account`);
  const data: ApiSummaryByAccount[] = await handleResponse(response);
  return data.map(transformAccountSummary);
}

export async function fetchBanks(): Promise<ApiBank[]> {
  const response = await fetch(`${API_BASE_URL}/banks`);
  return await handleResponse(response);
}

// Fetch all dashboard data
export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    const [
      accounts,
      transactionsData,
      summary,
      bankSummaries,
      accountSummaries,
    ] = await Promise.all([
      fetchAccounts(),
      fetchTransactions({ limit: 1000 }), // Fetch a large number of transactions
      fetchSummary(),
      fetchSummaryByBank(),
      fetchSummaryByAccount(),
    ]);

    return {
      transactions: transactionsData.transactions,
      accounts,
      failedParses: [], // API doesn't provide this, leaving empty
      bankSummaries,
      accountSummaries,
      allSummary: summary,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
}

// Export bank fetching for use in components
export type { ApiBank };

// Health check
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_HOST}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
