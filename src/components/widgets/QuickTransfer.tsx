import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const people = [
    { rank: 1, name: "Anna", amount: "$12k", initials: "AN", color: "ring-yellow-400", bg: "bg-yellow-400/20 text-yellow-500" },
    { rank: 2, name: "Mark", amount: "$8.5k", initials: "MA", color: "ring-gray-300", bg: "bg-gray-300/20 text-gray-400" },
    { rank: 3, name: "Sia", amount: "$5.2k", initials: "SI", color: "ring-orange-400", bg: "bg-orange-400/20 text-orange-500" },
];

export default function TopPeople() {
    return (
        <div className="glass-panel p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)] tracking-tight transition-colors duration-300">Top People</h3>
                <Link to="/people" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                    View All <ArrowRight size={12} />
                </Link>
            </div>

            <div className="flex justify-between items-end gap-4 h-32 mb-4 px-4">
                {/* 2nd Place */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full ring-2 ${people[1].color} p-0.5 flex items-center justify-center`}>
                            <div className={`w-full h-full rounded-full ${people[1].bg} flex items-center justify-center font-bold text-xs`}>
                                {people[1].initials}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--color-card)] text-[var(--color-foreground)] text-[10px] px-1.5 rounded-full border border-[var(--color-card-border)]">2</div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium text-[var(--color-foreground)]">{people[1].name}</p>
                        <p className="text-[10px] text-[var(--color-foreground)] opacity-50">{people[1].amount}</p>
                    </div>
                    <div className="w-12 h-16 bg-[var(--color-foreground)] opacity-5 rounded-t-lg border-t border-x border-[var(--color-card-border)]" />
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className={`w-16 h-16 rounded-full ring-2 ${people[0].color} p-0.5 shadow-[0_0_20px_rgba(250,204,21,0.3)] flex items-center justify-center`}>
                            <div className={`w-full h-full rounded-full ${people[0].bg} flex items-center justify-center font-bold text-sm`}>
                                {people[0].initials}
                            </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">1</div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium text-[var(--color-foreground)]">{people[0].name}</p>
                        <p className="text-[10px] text-[var(--color-foreground)] opacity-50">{people[0].amount}</p>
                    </div>
                    <div className="w-16 h-24 bg-gradient-to-b from-yellow-500/10 to-[var(--color-card)] rounded-t-lg border-t border-x border-yellow-500/20" />
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full ring-2 ${people[2].color} p-0.5 flex items-center justify-center`}>
                            <div className={`w-full h-full rounded-full ${people[2].bg} flex items-center justify-center font-bold text-xs`}>
                                {people[2].initials}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--color-card)] text-[var(--color-foreground)] text-[10px] px-1.5 rounded-full border border-[var(--color-card-border)]">3</div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium text-[var(--color-foreground)]">{people[2].name}</p>
                        <p className="text-[10px] text-[var(--color-foreground)] opacity-50">{people[2].amount}</p>
                    </div>
                    <div className="w-12 h-12 bg-[var(--color-foreground)] opacity-5 rounded-t-lg border-t border-x border-[var(--color-card-border)]" />
                </div>
            </div>
        </div>
    );
}
