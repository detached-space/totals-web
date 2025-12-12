import { motion, useMotionValue, useTransform } from "framer-motion";
import { Wifi } from "lucide-react";

type Props = {
    name: string;
    balance: number;
    bg?: string;
    type?: "visa" | "mastercard";
    last4?: string;
};

export default function AccountCard({ name, balance, bg, type = "visa", last4 = "4242" }: Props) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [0, 200], [10, -10]);
    const rotateY = useTransform(x, [0, 320], [-10, 10]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
    }

    function handleMouseLeave() {
        x.set(160); // approximate center
        y.set(100);
    }

    // Default gradient if none provided
    const background = bg || "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))";

    return (
        <div style={{ perspective: 1000 }} className="w-full h-full">
            <motion.div
                onMouseMove={handleMouse}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    background
                }}
                className="w-full aspect-[1.586/1] rounded-[1.5rem] p-6 text-white relative shadow-2xl border border-white/10 flex flex-col justify-between group cursor-grab active:cursor-grabbing"
            >
                {/* 3D Content Layer */}
                <div style={{ transform: "translateZ(30px)" }} className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-[1.5rem]" />

                {/* Top Row */}
                <div style={{ transform: "translateZ(50px)" }} className="flex justify-between items-start relative z-10 pointer-events-none">
                    <span className="font-semibold tracking-wide opacity-90 text-shadow-sm">{name}</span>
                    <Wifi className="w-8 h-8 opacity-70 rotate-90" />
                </div>

                {/* Chip */}
                <div style={{ transform: "translateZ(40px)" }} className="relative z-10 my-4 pointer-events-none">
                    <div className="w-12 h-9 bg-yellow-200/20 rounded-md border border-yellow-200/40 flex items-center justify-center relative overflow-hidden shadow-inner">
                        <div className="absolute inset-0 grid grid-cols-2 gap-[1px] bg-yellow-500/20">
                            <div className="col-span-1 border-r border-yellow-200/30" />
                            <div className="col-span-1" />
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div style={{ transform: "translateZ(60px)" }} className="relative z-10 mt-auto pointer-events-none">
                    <div className="mb-4">
                        <span className="text-3xl font-bold tracking-tight drop-shadow-md">
                            ${balance.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-end opacity-80">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-wider">Card Holder</span>
                            <span className="font-mono tracking-widest text-sm">**** **** **** {last4}</span>
                        </div>
                        <div className="font-bold italic text-xl">
                            {type === 'visa' ? 'VISA' : 'Mastercard'}
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none mix-blend-overlay" />
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 blur-[60px] rounded-full pointer-events-none mix-blend-overlay" />

                {/* Specular */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[1.5rem]" />
            </motion.div>
        </div>
    );
}