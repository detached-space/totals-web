import type { Transaction, Account, Person, SpendingCategory, NetWorthDataPoint, ActivityItem, Budget, Goal } from './types';

// ─── Accounts ────────────────────────────────────────────────
export const accounts: Account[] = [
    { id: 1, name: "Commercial Bank of Ethiopia", balance: 24500.80, accountNumber: "8821 2514 1241 2421" },
    { id: 2, name: "Awash Bank", balance: 18750.50, accountNumber: "4412 8821 3301 5567" },
    { id: 3, name: "Bank of Abyssinia", balance: 12400.00, accountNumber: "3321 7788 4455 9900" },
    { id: 4, name: "Dashen Bank", balance: 31200.30, accountNumber: "8821 6654 2233 1100" },
    { id: 6, name: "Telebirr", balance: 8340.25, accountNumber: "0911 2233 4455" },
];

export const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

// ─── Transactions ────────────────────────────────────────────
export const transactions: Transaction[] = [
    { amount: 2500.00, reference: "Salary Deposit", creditor: "Tech Corp Inc.", time: "2025-03-28T09:00:00Z", status: "CLEARED", type: "CREDIT", transactionLink: "https://bank.com", accountNumber: "8821", bankId: 1 },
    { amount: -1200.00, reference: "Monthly Rent", creditor: "Landlord", time: "2025-03-27T08:00:00Z", status: "CLEARED", type: "DEBIT", accountNumber: "8821", bankId: 1 },
    { amount: -9.99, reference: "Spotify Premium", creditor: "Spotify Ltd", time: "2025-03-27T10:23:00Z", status: "CLEARED", type: "DEBIT", transactionLink: "https://spotify.com", accountNumber: "4412", bankId: 2 },
    { amount: -45.00, reference: "Grocery Shopping", creditor: "Fresh Market", time: "2025-03-26T16:20:00Z", status: "SYNCED", type: "DEBIT", accountNumber: "3321", bankId: 3 },
    { amount: 800.00, reference: "Freelance Payment", creditor: "Client ABC", time: "2025-03-26T14:00:00Z", status: "CLEARED", type: "CREDIT", accountNumber: "8821", bankId: 1 },
    { amount: -12.50, reference: "Uber Ride", creditor: "Uber Technologies", time: "2025-03-25T18:45:00Z", status: "PENDING", type: "DEBIT", transactionLink: "https://uber.com", accountNumber: "4412", bankId: 2 },
    { amount: -4.50, reference: "Morning Coffee", creditor: "Kaldi's Coffee", time: "2025-03-25T08:30:00Z", status: "CLEARED", type: "DEBIT", accountNumber: "8821", bankId: 4 },
    { amount: 1500.00, reference: "Transfer In", creditor: "Savings Account", time: "2025-03-24T12:00:00Z", status: "CLEARED", type: "CREDIT", accountNumber: "8821", bankId: 1 },
    { amount: -250.00, reference: "Electric Bill", creditor: "EEU", time: "2025-03-24T10:00:00Z", status: "SYNCED", type: "DEBIT", accountNumber: "3321", bankId: 3 },
    { amount: -89.99, reference: "Annual Subscription", creditor: "Adobe Creative", time: "2025-03-23T15:00:00Z", status: "CLEARED", type: "DEBIT", transactionLink: "https://adobe.com", accountNumber: "4412", bankId: 2 },
    { amount: -35.00, reference: "Lunch with Team", creditor: "Yod Abyssinia", time: "2025-03-23T13:00:00Z", status: "CLEARED", type: "DEBIT", accountNumber: "8821", bankId: 4 },
    { amount: 3200.00, reference: "Bonus Payment", creditor: "Tech Corp Inc.", time: "2025-03-22T09:00:00Z", status: "CLEARED", type: "CREDIT", accountNumber: "8821", bankId: 1 },
    { amount: -150.00, reference: "Phone Top-up", creditor: "Ethio Telecom", time: "2025-03-22T11:30:00Z", status: "CLEARED", type: "DEBIT", accountNumber: "0911", bankId: 6 },
    { amount: -22.00, reference: "Book Purchase", creditor: "Amazon Kindle", time: "2025-03-21T20:00:00Z", status: "CLEARED", type: "DEBIT", transactionLink: "https://amazon.com", accountNumber: "4412", bankId: 2 },
    { amount: -65.00, reference: "Water Bill", creditor: "AAWSA", time: "2025-03-21T09:00:00Z", status: "SYNCED", type: "DEBIT", accountNumber: "3321", bankId: 3 },
    { amount: 500.00, reference: "Refund", creditor: "Online Store", time: "2025-03-20T16:00:00Z", status: "CLEARED", type: "CREDIT", accountNumber: "4412", bankId: 2 },
    { amount: -180.00, reference: "Gym Membership", creditor: "FitZone", time: "2025-03-20T07:00:00Z", status: "CLEARED", type: "DEBIT", accountNumber: "8821", bankId: 4 },
    { amount: -8.99, reference: "Netflix", creditor: "Netflix Inc.", time: "2025-03-19T22:00:00Z", status: "CLEARED", type: "DEBIT", accountNumber: "4412", bankId: 2 },
    { amount: -320.00, reference: "Flight Booking", creditor: "Ethiopian Airlines", time: "2025-03-19T14:00:00Z", status: "CLEARED", type: "DEBIT", transactionLink: "https://ethiopianairlines.com", accountNumber: "8821", bankId: 1 },
    { amount: 4500.00, reference: "Contract Payment", creditor: "Client XYZ", time: "2025-03-18T10:00:00Z", status: "CLEARED", type: "CREDIT", accountNumber: "8821", bankId: 1 },
];

export const incomeTotal = transactions.filter(t => t.type === 'CREDIT').reduce((sum, t) => sum + t.amount, 0);
export const expenseTotal = transactions.filter(t => t.type === 'DEBIT').reduce((sum, t) => sum + Math.abs(t.amount), 0);

// ─── People ──────────────────────────────────────────────────
export const topPeople: Person[] = [
    { rank: 1, name: "Anna", amount: "$15,240", initials: "AN", color: "ring-yellow-400", bg: "bg-yellow-400/20 text-yellow-500" },
    { rank: 2, name: "Mark", amount: "$8,500", initials: "MA", color: "ring-gray-300", bg: "bg-gray-300/20 text-gray-400" },
    { rank: 3, name: "Sia", amount: "$6,200", initials: "SI", color: "ring-orange-400", bg: "bg-orange-400/20 text-orange-500" },
];

export const allPeople: Person[] = [
    ...topPeople,
    { rank: 4, name: "Daniel", amount: "$5,100", initials: "DA", color: "", bg: "bg-blue-400/20 text-blue-400", lastTransaction: "Sent $200", date: "2 days ago" },
    { rank: 5, name: "Hana", amount: "$4,700", initials: "HA", color: "", bg: "bg-pink-400/20 text-pink-400", lastTransaction: "Received $350", date: "3 days ago" },
    { rank: 6, name: "Yonas", amount: "$4,300", initials: "YO", color: "", bg: "bg-green-400/20 text-green-400", lastTransaction: "Sent $120", date: "4 days ago" },
    { rank: 7, name: "Liya", amount: "$3,800", initials: "LI", color: "", bg: "bg-purple-400/20 text-purple-400", lastTransaction: "Received $500", date: "5 days ago" },
    { rank: 8, name: "Kebede", amount: "$3,200", initials: "KE", color: "", bg: "bg-teal-400/20 text-teal-400", lastTransaction: "Sent $80", date: "1 week ago" },
    { rank: 9, name: "Sara", amount: "$2,900", initials: "SA", color: "", bg: "bg-rose-400/20 text-rose-400", lastTransaction: "Received $150", date: "1 week ago" },
    { rank: 10, name: "Abel", amount: "$2,500", initials: "AB", color: "", bg: "bg-amber-400/20 text-amber-400", lastTransaction: "Sent $300", date: "2 weeks ago" },
    { rank: 11, name: "Meron", amount: "$2,100", initials: "ME", color: "", bg: "bg-cyan-400/20 text-cyan-400", lastTransaction: "Sent $45", date: "2 weeks ago" },
    { rank: 12, name: "Tewodros", amount: "$1,800", initials: "TE", color: "", bg: "bg-indigo-400/20 text-indigo-400", lastTransaction: "Received $200", date: "3 weeks ago" },
    { rank: 13, name: "Selam", amount: "$1,400", initials: "SE", color: "", bg: "bg-lime-400/20 text-lime-400", lastTransaction: "Sent $60", date: "3 weeks ago" },
];

// ─── Spending Categories ─────────────────────────────────────
export const spendingCategories: SpendingCategory[] = [
    { name: "Food & Drinks", value: 480, color: "#f87171" },
    { name: "Rent", value: 1200, color: "#60a5fa" },
    { name: "Travel", value: 320, color: "#fbbf24" },
    { name: "Subscriptions", value: 109, color: "#a78bfa" },
    { name: "Utilities", value: 315, color: "#34d399" },
    { name: "Shopping", value: 202, color: "#fb923c" },
];

export const totalSpending = spendingCategories.reduce((sum, c) => sum + c.value, 0);

// ─── Net Worth History ───────────────────────────────────────
export const netWorthData: NetWorthDataPoint[] = [
    { month: "Sep", value: 52000 },
    { month: "Oct", value: 58500 },
    { month: "Nov", value: 55800 },
    { month: "Dec", value: 62200 },
    { month: "Jan", value: 71000 },
    { month: "Feb", value: 68500 },
    { month: "Mar", value: 95191 },
];

// ─── Monthly Income vs Expense ───────────────────────────────
export const monthlyComparison = [
    { month: "Sep", income: 8500, expenses: 6200 },
    { month: "Oct", income: 9200, expenses: 7100 },
    { month: "Nov", income: 7800, expenses: 6500 },
    { month: "Dec", income: 11000, expenses: 8200 },
    { month: "Jan", income: 9500, expenses: 7000 },
    { month: "Feb", income: 8800, expenses: 6800 },
    { month: "Mar", income: 13000, expenses: 7500 },
];

// ─── Activity Feed ───────────────────────────────────────────
export const activityFeed: ActivityItem[] = [
    { id: 1, type: 'transaction', title: 'Salary Deposit', description: 'Received from Tech Corp Inc.', timestamp: '2025-03-28T09:00:00Z', amount: 2500, accountId: 1 },
    { id: 2, type: 'transaction', title: 'Monthly Rent', description: 'Paid to Landlord', timestamp: '2025-03-27T08:00:00Z', amount: -1200, accountId: 1 },
    { id: 3, type: 'account', title: 'Account Synced', description: 'Awash Bank account synced successfully', timestamp: '2025-03-27T06:00:00Z', accountId: 2 },
    { id: 4, type: 'transaction', title: 'Spotify Premium', description: 'Monthly subscription renewed', timestamp: '2025-03-27T10:23:00Z', amount: -9.99, accountId: 2 },
    { id: 5, type: 'milestone', title: 'Savings Milestone', description: 'You\'ve saved over $10,000 this quarter!', timestamp: '2025-03-26T18:00:00Z' },
    { id: 6, type: 'transaction', title: 'Grocery Shopping', description: 'Paid to Fresh Market', timestamp: '2025-03-26T16:20:00Z', amount: -45, accountId: 3 },
    { id: 7, type: 'transaction', title: 'Freelance Payment', description: 'Received from Client ABC', timestamp: '2025-03-26T14:00:00Z', amount: 800, accountId: 1 },
    { id: 8, type: 'account', title: 'New Account Connected', description: 'Telebirr account linked to Totals', timestamp: '2025-03-25T20:00:00Z', accountId: 6 },
    { id: 9, type: 'transaction', title: 'Uber Ride', description: 'Paid to Uber Technologies', timestamp: '2025-03-25T18:45:00Z', amount: -12.5, accountId: 2 },
    { id: 10, type: 'transaction', title: 'Morning Coffee', description: 'Paid to Kaldi\'s Coffee', timestamp: '2025-03-25T08:30:00Z', amount: -4.5, accountId: 4 },
    { id: 11, type: 'milestone', title: 'Budget on Track', description: 'You\'re within budget for 3 consecutive months', timestamp: '2025-03-24T20:00:00Z' },
    { id: 12, type: 'transaction', title: 'Transfer In', description: 'From Savings Account', timestamp: '2025-03-24T12:00:00Z', amount: 1500, accountId: 1 },
    { id: 13, type: 'transaction', title: 'Electric Bill', description: 'Paid to EEU', timestamp: '2025-03-24T10:00:00Z', amount: -250, accountId: 3 },
    { id: 14, type: 'account', title: 'Statement Ready', description: 'Your CBE monthly statement is ready', timestamp: '2025-03-23T22:00:00Z', accountId: 1 },
    { id: 15, type: 'transaction', title: 'Adobe Creative', description: 'Annual subscription renewed', timestamp: '2025-03-23T15:00:00Z', amount: -89.99, accountId: 2 },
    { id: 16, type: 'transaction', title: 'Lunch with Team', description: 'Paid to Yod Abyssinia', timestamp: '2025-03-23T13:00:00Z', amount: -35, accountId: 4 },
    { id: 17, type: 'transaction', title: 'Bonus Payment', description: 'Received from Tech Corp Inc.', timestamp: '2025-03-22T09:00:00Z', amount: 3200, accountId: 1 },
    { id: 18, type: 'milestone', title: 'Net Worth Record', description: 'Your net worth reached an all-time high!', timestamp: '2025-03-22T08:00:00Z' },
    { id: 19, type: 'transaction', title: 'Phone Top-up', description: 'Paid to Ethio Telecom', timestamp: '2025-03-22T11:30:00Z', amount: -150, accountId: 6 },
    { id: 20, type: 'transaction', title: 'Book Purchase', description: 'Paid to Amazon Kindle', timestamp: '2025-03-21T20:00:00Z', amount: -22, accountId: 2 },
    { id: 21, type: 'account', title: 'Security Alert', description: 'New login from your device detected', timestamp: '2025-03-21T15:00:00Z' },
    { id: 22, type: 'transaction', title: 'Water Bill', description: 'Paid to AAWSA', timestamp: '2025-03-21T09:00:00Z', amount: -65, accountId: 3 },
    { id: 23, type: 'transaction', title: 'Refund', description: 'Received from Online Store', timestamp: '2025-03-20T16:00:00Z', amount: 500, accountId: 2 },
    { id: 24, type: 'transaction', title: 'Gym Membership', description: 'Paid to FitZone', timestamp: '2025-03-20T07:00:00Z', amount: -180, accountId: 4 },
    { id: 25, type: 'transaction', title: 'Flight Booking', description: 'Paid to Ethiopian Airlines', timestamp: '2025-03-19T14:00:00Z', amount: -320, accountId: 1 },
];

// ─── Budgets ─────────────────────────────────────────────────
export const budgets: Budget[] = [
    { category: "Food & Drinks", budgeted: 600, spent: 480, color: "#f87171", icon: "UtensilsCrossed" },
    { category: "Rent", budgeted: 1200, spent: 1200, color: "#60a5fa", icon: "Home" },
    { category: "Travel", budgeted: 400, spent: 320, color: "#fbbf24", icon: "Plane" },
    { category: "Subscriptions", budgeted: 150, spent: 109, color: "#a78bfa", icon: "CreditCard" },
    { category: "Utilities", budgeted: 400, spent: 315, color: "#34d399", icon: "Zap" },
];

export const totalBudgeted = budgets.reduce((sum, b) => sum + b.budgeted, 0);
export const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

// ─── Goals ───────────────────────────────────────────────────
export const goals: Goal[] = [
    { id: 1, title: "Emergency Fund", target: 50000, current: 32500, icon: "Shield", color: "#60a5fa" },
    { id: 2, title: "Vacation Trip", target: 15000, current: 11200, icon: "Plane", color: "#fbbf24" },
    { id: 3, title: "New Laptop", target: 8000, current: 6400, icon: "Laptop", color: "#a78bfa" },
];

// ─── Pie chart data for transactions by account ──────────────
export const transactionsByAccount = [
    { name: 'CBE', value: 8, color: '#a78bfa' },
    { name: 'Awash', value: 6, color: '#60a5fa' },
    { name: 'BOA', value: 3, color: '#fbbf24' },
    { name: 'Dashen', value: 3, color: '#f87171' },
    { name: 'Telebirr', value: 1, color: '#34d399' },
];

export const volumeByAccount = [
    { name: 'CBE', value: 12400, color: '#a78bfa' },
    { name: 'Awash', value: 8200, color: '#60a5fa' },
    { name: 'BOA', value: 3600, color: '#fbbf24' },
    { name: 'Dashen', value: 4700, color: '#f87171' },
    { name: 'Telebirr', value: 1500, color: '#34d399' },
];
