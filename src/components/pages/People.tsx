import { ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";

// Mock Data
const topPeople = [
    { rank: 1, name: "Anna", amount: "$15,240", initials: "AN", color: "ring-yellow-400", bg: "bg-yellow-400/20 text-yellow-500" },
    { rank: 2, name: "Mark", amount: "$8,500", initials: "MA", color: "ring-gray-300", bg: "bg-gray-300/20 text-gray-400" },
    { rank: 3, name: "Sia", amount: "$6,200", initials: "SI", color: "ring-orange-400", bg: "bg-orange-400/20 text-orange-500" },
];

const otherPeople = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 4,
    name: `Person ${i + 4}`,
    amount: `$${(5000 - i * 400).toLocaleString()}`,
    initials: `P${i + 4}`,
    color: "bg-[var(--color-foreground)]/10 text-[var(--color-foreground)]",
    lastTransaction: i % 2 === 0 ? "Sent $200" : "Received $50",
    date: "2 days ago"
}));

export default function People() {
    return (
        <div className="min-h-screen px-8 pb-8 text-[var(--color-foreground)] max-w-[1600px] mx-auto">
            <h1 className="text-3xl font-bold mb-8">People</h1>

            {/* Leaderboard Section */}
            <div className="glass-panel p-8 mb-8 flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-8 opacity-80">Top Interactions</h2>

                <div className="flex items-end justify-center gap-4 md:gap-12 pb-4">
                    {/* 2nd Place */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <div className={`w-20 h-20 rounded-full ring-4 ${topPeople[1].color} p-1 flex items-center justify-center`}>
                                <div className={`w-full h-full rounded-full ${topPeople[1].bg} flex items-center justify-center text-xl font-bold`}>
                                    {topPeople[1].initials}
                                </div>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--color-card)] border border-[var(--color-card-border)] text-[var(--color-foreground)] text-xs font-bold px-3 py-1 rounded-full shadow-lg">2</div>
                        </div>
                        <div className="text-center mt-2">
                            <h3 className="font-semibold text-lg">{topPeople[1].name}</h3>
                            <p className="text-sm opacity-60 font-mono">{topPeople[1].amount}</p>
                        </div>
                        <div className="w-20 h-24 bg-[var(--color-foreground)] opacity-5 rounded-t-xl border-t border-x border-[var(--color-card-border)]" />
                    </div>

                    {/* 1st Place */}
                    <div className="flex flex-col items-center gap-3 -translate-y-4">
                        <div className="relative">
                            <div className={`w-28 h-28 rounded-full ring-4 ${topPeople[0].color} p-1 shadow-[0_0_40px_rgba(250,204,21,0.4)] flex items-center justify-center`}>
                                <div className={`w-full h-full rounded-full ${topPeople[0].bg} flex items-center justify-center text-3xl font-bold`}>
                                    {topPeople[0].initials}
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-sm font-bold px-4 py-1 rounded-full shadow-lg border border-yellow-200">1</div>
                        </div>
                        <div className="text-center mt-2">
                            <h3 className="font-bold text-xl">{topPeople[0].name}</h3>
                            <p className="text-sm opacity-60 font-mono">{topPeople[0].amount}</p>
                        </div>
                        <div className="w-28 h-32 bg-gradient-to-b from-yellow-400/10 to-[var(--color-card)] rounded-t-xl border-t border-x border-yellow-400/20" />
                    </div>

                    {/* 3rd Place */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <div className={`w-20 h-20 rounded-full ring-4 ${topPeople[2].color} p-1 flex items-center justify-center`}>
                                <div className={`w-full h-full rounded-full ${topPeople[2].bg} flex items-center justify-center text-xl font-bold`}>
                                    {topPeople[2].initials}
                                </div>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--color-card)] border border-[var(--color-card-border)] text-[var(--color-foreground)] text-xs font-bold px-3 py-1 rounded-full shadow-lg">3</div>
                        </div>
                        <div className="text-center mt-2">
                            <h3 className="font-semibold text-lg">{topPeople[2].name}</h3>
                            <p className="text-sm opacity-60 font-mono">{topPeople[2].amount}</p>
                        </div>
                        <div className="w-20 h-16 bg-[var(--color-foreground)] opacity-5 rounded-t-xl border-t border-x border-[var(--color-card-border)]" />
                    </div>
                </div>
            </div>

            {/* Everyone Else Table */}
            <div className="glass-panel p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Contacts</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
                        <input
                            type="text"
                            placeholder="Search people..."
                            className="bg-[var(--color-foreground)]/5 border border-[var(--color-card-border)] rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-[var(--color-foreground)]/30 transition-colors placeholder:text-[var(--color-foreground)]/30"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    {otherPeople.map((person) => (
                        <div key={person.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-[var(--color-foreground)]/5 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${person.color}`}>
                                    {person.initials}
                                </div>
                                <div>
                                    <h4 className="font-medium text-[var(--color-foreground)]">{person.name}</h4>
                                    <p className="text-xs opacity-50">{person.date}</p>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="block font-bold text-[var(--color-foreground)]">{person.amount}</span>
                                <span className="text-xs opacity-50 flex items-center justify-end gap-1">
                                    {person.lastTransaction}
                                    {person.lastTransaction.includes('Sent') ? <ArrowUpRight size={10} className="text-red-400" /> : <ArrowDownLeft size={10} className="text-green-400" />}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
