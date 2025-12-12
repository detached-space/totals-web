import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const people = [
    { rank: 1, name: "Anna", amount: "$12k", img: "https://i.pravatar.cc/150?u=a042581f4e29026024d", color: "ring-yellow-400" },
    { rank: 2, name: "Mark", amount: "$8.5k", img: "https://i.pravatar.cc/150?u=a042581f4e29026704d", color: "ring-gray-300" },
    { rank: 3, name: "Sia", amount: "$5.2k", img: "https://i.pravatar.cc/150?u=a04258114e29026302d", color: "ring-orange-400" },
];

export default function TopPeople() {
    return (
        <div className="glass-panel p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white/90">Top People</h3>
                <Link to="/people" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                    View All <ArrowRight size={12} />
                </Link>
            </div>

            <div className="flex justify-center items-end gap-4 h-32 mb-4">
                {/* 2nd Place */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full ring-2 ${people[1].color} p-0.5`}>
                            <img src={people[1].img} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 text-[10px] px-1.5 rounded-full border border-gray-600">2</div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium">{people[1].name}</p>
                        <p className="text-[10px] text-white/50">{people[1].amount}</p>
                    </div>
                    <div className="w-12 h-16 bg-white/5 rounded-t-lg border-t border-x border-white/10" />
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className={`w-16 h-16 rounded-full ring-2 ${people[0].color} p-0.5 shadow-[0_0_20px_rgba(250,204,21,0.3)]`}>
                            <img src={people[0].img} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">1</div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium">{people[0].name}</p>
                        <p className="text-[10px] text-white/50">{people[0].amount}</p>
                    </div>
                    <div className="w-16 h-24 bg-gradient-to-b from-yellow-500/10 to-white/5 rounded-t-lg border-t border-x border-yellow-500/20" />
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className={`w-12 h-12 rounded-full ring-2 ${people[2].color} p-0.5`}>
                            <img src={people[2].img} className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 text-[10px] px-1.5 rounded-full border border-gray-600">3</div>
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-medium">{people[2].name}</p>
                        <p className="text-[10px] text-white/50">{people[2].amount}</p>
                    </div>
                    <div className="w-12 h-12 bg-white/5 rounded-t-lg border-t border-x border-white/10" />
                </div>
            </div>
        </div>
    );
}
