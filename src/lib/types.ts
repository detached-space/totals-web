export interface Transaction {
  amount: number; // required
  reference: string; // required
  creditor?: string;
  receiver?: string;
  time?: string; // ISO string
  status?: "PENDING" | "CLEARED" | "SYNCED" | string;
  currentBalance?: string;
  bankId?: number;
  type?: "CREDIT" | "DEBIT" | string;
  transactionLink?: string;
  accountNumber?: string; // Last 4 digits
  // Extended fields for enterprise transactions page
  id?: string; // Unique transaction ID
  currency?: string; // Currency code (default: ETB)
  category?: string; // Transaction category
  tags?: string[]; // Tags for classification
  notes?: string; // User notes
  counterparty?: string; // Normalized counterparty name
  parsingConfidence?: number; // 0-100 confidence score
  rawSms?: string; // Immutable raw SMS content
  smsSenderId?: string; // SMS sender ID
  smsReceivedAt?: string; // ISO string - when SMS was received
  parsingRegex?: string; // Regex pattern used for parsing
  parsingErrors?: string[]; // Any parsing errors
  isDuplicate?: boolean; // Flag for duplicate detection
  isFlagged?: boolean; // Flag for investigation
  isReviewed?: boolean; // Flag for review status
  auditTrail?: AuditEntry[]; // Full audit trail
}

export interface AuditEntry {
  userId: string;
  userName: string;
  action: string; // "EDIT", "CATEGORIZE", "FLAG", etc.
  field?: string; // Field that was changed
  oldValue?: string;
  newValue?: string;
  timestamp: string; // ISO string
}

export interface Account {
  accountNumber: string;
  bank: number; // Mapped to 'bank' in JSON
  balance: number;
  accountHolderName: string;
  settledBalance?: number;
  pendingCredit?: number;
}

export interface FailedParse {
  address: string;
  body: string;
  reason: string;
  timestamp: string; // ISO string
}

export interface BankSummary {
  bankId: number;
  totalCredit: number;
  totalDebit: number;
  settledBalance: number;
  pendingCredit: number;
  totalBalance: number;
  accountCount: number;
}

export interface AccountSummary {
  bankId: number;
  accountNumber: string;
  accountHolderName: string;
  totalTransactions: number;
  totalCredit: number;
  totalDebit: number;
  settledBalance: number;
  pendingCredit: number;
  balance: number;
}

export interface AllSummary {
  totalCredit: number;
  totalDebit: number;
  banks: number;
  accounts: number;
  totalBalance: number;
}

export interface DashboardData {
  transactions: Transaction[];
  accounts: Account[];
  failedParses: FailedParse[];
  bankSummaries: BankSummary[];
  accountSummaries: AccountSummary[];
  allSummary: AllSummary;
}
