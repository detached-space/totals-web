import AccountCard from "../components/cards/AccountCard";
import NetWorthChart from "../components/charts/NetWorthChart";
import TransactionsTable from "../components/tables/TransactionsTable";

export default function Dashboard() {
    return (
        <div className="p-6 flex flex-col gap-6 bg-[var(--color-bg)] text-[var(--color-text)]">
            <div className="grid grid-cols-3 gap-6">
                <AccountCard name="Chase Bank" balance={5200} bg="linear-gradient(135deg, #696cff, #4f46e5)" />
                <AccountCard name="Bank of America" balance={12400} bg="linear-gradient(135deg, #10b981, #059669)" />
                <AccountCard name="CashApp" balance={800} bg="linear-gradient(135deg, #f2994a, #d97706)" />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2">
                    <NetWorthChart />
                </div>
                <TransactionsTable />
            </div>
        </div>
    );
}