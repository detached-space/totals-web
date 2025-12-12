import { ArrowRight } from "lucide-react";

const accounts = [
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg", // MC
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg", // Visa
    "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg", // PayPal
    "https://upload.wikimedia.org/wikipedia/commons/f/ff/Stripe_Logo%2C_revised_2016.svg", // Stripe
];

export default function ConnectedAccounts() {
    return (
        <div className="glass-panel p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white/90">Connections</h3>
                    <span className="text-3xl font-bold text-white mt-2 block">4</span>
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
