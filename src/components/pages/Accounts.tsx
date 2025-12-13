import { useState } from "react";
import { ChevronDown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import AccountCard from "../cards/AccountCard";
import NetWorthChart from "../charts/NetWorthChart";
import TransactionsTable from "../tables/TransactionsTable";

const accounts = [
    { "id": 1, "name": "Comercial bank of ethiopia", "balance": 24500.80, "accountNumber": "8821 2514 12412 21" },
    { "id": 2, "name": "Awash", "balance": 24500.80, "accountNumber": "8821" },
    { "id": 3, "name": "Bank of Abysinna", "balance": 12400.00, "accountNumber": "3321" },
    { "id": 4, "name": "Dashen", "balance": 24500.80, "accountNumber": "8821" },
    { "id": 6, "name": "Telebirr", "balance": 24500.80, "accountNumber": "8821" },
]

export default function Accounts() {
    const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
    const [timeframe, setTimeframe] = useState("This Month");

    return (
        <div className="min-h-screen px-8 pb-8 text-[var(--color-foreground)] max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Accounts</h1>
                    <p className="text-[var(--color-foreground)] opacity-60">Manage and view details for your connected accounts.</p>
                </div>

                {/* Account Selector Dropdown */}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button className="glass-button px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium outline-none">
                            {selectedAccount.name}
                            <ChevronDown size={16} className="opacity-50" />
                        </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="min-w-[220px] glass-panel bg-black/80 backdrop-blur-xl border border-[var(--color-card-border)] rounded-xl p-1 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200" sideOffset={5}>
                            {accounts.map((acc) => (
                                <DropdownMenu.Item
                                    key={acc.id}
                                    className="text-sm px-3 py-2 rounded-lg outline-none cursor-pointer text-[var(--color-foreground)] hover:bg-[var(--color-foreground)]/10 transition-colors"
                                    onClick={() => setSelectedAccount(acc)}
                                >
                                    {acc.name}
                                </DropdownMenu.Item>
                            ))}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Selected Account Card - Full Width or Large */}
                <div className="col-span-12 lg:col-span-4 h-[240px]">
                    <AccountCard
                        id={selectedAccount.id}
                        name={selectedAccount.name}
                        balance={selectedAccount.balance}
                        accountNumber={selectedAccount.accountNumber}
                    />
                </div>

                {/* Charts Area */}
                <div className="col-span-12 lg:col-span-8 h-[500px]"> {/* Increased Height */}
                    <div className="w-full h-full glass-panel p-8 flex flex-col"> {/* Increased Padding */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Activity Overview</h3>
                            <div className="flex bg-[var(--color-foreground)]/5 p-1 rounded-lg">
                                {["1W", "1M", "3M", "1Y", "ALL"].map((tf) => (
                                    <button
                                        key={tf}
                                        onClick={() => setTimeframe(tf)}
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${timeframe === tf ? 'bg-[var(--color-foreground)] text-[var(--color-background)] shadow-sm' : 'text-[var(--color-foreground)]/60 hover:text-[var(--color-foreground)]'}`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <NetWorthChart />
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="col-span-12 min-h-[500px]">
                    <TransactionsTable />
                </div>
            </div>
        </div>
    );
}
