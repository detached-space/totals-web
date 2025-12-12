import AccountCard from "../components/cards/AccountCard";
import NetWorthChart from "../components/charts/NetWorthChart";
import TransactionsTable from "../components/tables/TransactionsTable";


export default function Dashboard() {
    return (
        <div className="p-6 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-6">
                <AccountCard name="Chase Bank" balance={5200} bg="linear-gradient(135deg, #6366F1, #4F46E5)" />
                <AccountCard name="Bank of America" balance={12400} bg="linear-gradient(135deg, #10B981, #059669)" />
                <AccountCard name="CashApp" balance={800} bg="linear-gradient(135deg, #F59E0B, #D97706)" />
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