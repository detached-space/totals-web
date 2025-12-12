const rows = [
    { name: "Spotify Subscription", amount: -9.99, date: "2025-02-10" },
    { name: "Salary Deposit", amount: 3500, date: "2025-02-02" },
    { name: "Groceries", amount: -42.5, date: "2025-02-01" },
];


export default function TransactionsTable() {
    return (
        <div className="rounded-xl border p-4 bg-background shadow-sm">
            <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
            <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                    <tr>
                        <th align="left">Name</th>
                        <th align="right">Amount</th>
                        <th align="right">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i} className="border-t">
                            <td className="py-2">{r.name}</td>
                            <td align="right" className={r.amount < 0 ? "text-red-500" : "text-green-500"}>
                                {r.amount < 0 ? "-" : "+"}${Math.abs(r.amount)}
                            </td>
                            <td align="right">{r.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}