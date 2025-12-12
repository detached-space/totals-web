import { ArrowRight } from "lucide-react";
import awash from "../../assets/awash.svg";
import telebirr from "../../assets/telebirr.svg";
import boa from "../../assets/boa.svg";
import cbe from "../../assets/cbe.svg";
import dashen from "../../assets/dashen.svg";


const accounts = [
    awash,
    telebirr,
    boa,
    cbe,
    dashen,
];

export default function ConnectedAccounts() {
    return (
        <div className="glass-panel p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white/90">Connected Accounts</h3>
                    <span className="text-3xl font-bold text-white mt-2 block">5</span>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                    View All <ArrowRight size={12} />
                </button>
            </div>

            <div className="flex items-center -space-x-2 overflow-hidden py-2">
                {accounts.map((src, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-white flex items-center justify-center overflow-hidden">
                        <img src={src} className="w-8 h-8 object-contain" />
                    </div>
                ))}
            </div>
        </div>
    );
}
