import AccountCard from "../cards/AccountCard";
import NetWorthChart from "../charts/NetWorthChart";
import TransactionsTable from "../tables/TransactionsTable";
import TopPeople from "../widgets/QuickTransfer";
import SpendingStats from "../widgets/SpendingStats";
import ConnectedAccounts from "../widgets/ConnectedAccounts";
const accounts = [
    {
        "id": 1, "name": "Comercial bank of ethiopia", "balance": 24500.80, "accountNumber": "8821 2514 12412 21"
    },
    { "id": 2, "name": "Awash", "balance": 24500.80, "accountNumber": "8821" },
    { "id": 3, "name": "Bank of Abysinna", "balance": 12400.00, "accountNumber": "3321" },
    {
        "id": 4, "name": "Dashen", "balance": 24500.80, "accountNumber": "8821"
    },
    {
        "id": 6, "name": "Telebirr", "balance": 24500.80, "accountNumber": "8821"
    },
]
export default function Dashboard() {
    return (
        <div className="min-h-screen px-8 pb-8 text-white max-w-[1600px] mx-auto">
            {/* Content Grid */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left Column (Cards + Chart + Transactions Table) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    {/* Cards Scroll/Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {accounts.map((account, i) => (
                            <AccountCard
                                key={i}
                                id={account.id}
                                name={account.name}
                                balance={account.balance}
                                accountNumber={account.accountNumber}
                            />
                        ))}

                    </div>

                    {/* Chart Section */}
                    <div className="h-[400px]">
                        <NetWorthChart />
                    </div>

                    {/* Transactions Area */}
                    <div className="flex-1 min-h-[400px]">
                        <TransactionsTable />
                    </div>
                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <ConnectedAccounts />
                    <TopPeople />
                    <div className="h-[350px]">
                        <SpendingStats />
                    </div>
                </div>
            </div>

            {/* Background Ambience */}
            <div className="fixed top-20 left-10 w-96 h-96 bg-purple-600/20 blur-[120px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
            <div className="fixed bottom-10 right-10 w-96 h-96 bg-blue-600/10 blur-[120px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
        </div>
    );
}