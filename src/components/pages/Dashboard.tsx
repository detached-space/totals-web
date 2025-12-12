import AccountCard from "../cards/AccountCard";
import NetWorthChart from "../charts/NetWorthChart";
import TransactionsTable from "../tables/TransactionsTable";
import QuickTransfer from "../widgets/QuickTransfer";
import SpendingStats from "../widgets/SpendingStats";


export default function Dashboard() {
    return (
        <div className="min-h-screen px-8 pb-8 text-white max-w-[1600px] mx-auto">
            {/* Content Grid */}
            <div className="grid grid-cols-12 gap-8">

                {/* Left Column (Cards + Chart) */}
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                    {/* Cards Scroll/Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AccountCard
                            name="Main Account"
                            balance={24500.80}
                            bg="linear-gradient(135deg, #1e1e1e, #2d2d2d)"
                            type="visa"
                            last4="8821"
                        />
                        <div className="hidden md:block">
                            <AccountCard
                                name="Savings Vault"
                                balance={12400.00}
                                bg="linear-gradient(135deg, #0f172a, #334155)"
                                type="mastercard"
                                last4="3321"
                            />
                        </div>
                        {/* Mobile only stack or add carousel later */}
                    </div>

                    {/* Chart Section */}
                    <div className="h-[400px]">
                        <NetWorthChart />
                    </div>

                    {/* Secondary Cards (e.g. Loans or smaller accounts) could go here */}
                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                    <QuickTransfer />

                    <div className="h-[300px]">
                        <SpendingStats />
                    </div>

                    <div className="flex-1 min-h-[400px]">
                        <TransactionsTable />
                    </div>
                </div>
            </div>

            {/* Background Ambience */}
            <div className="fixed top-20 left-10 w-96 h-96 bg-purple-600/20 blur-[120px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
            <div className="fixed bottom-10 right-10 w-96 h-96 bg-blue-600/10 blur-[120px] -z-10 rounded-full pointer-events-none mix-blend-screen" />
        </div>
    );
}