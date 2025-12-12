import { motion, useMotionValue, useTransform } from "framer-motion";
import logo from "../../assets/logo.svg"


type Props = {
    name: string;
    balance: number;
    bg?: string;
    type?: string;
    last4?: string;
};

export default function AccountCard({ name, balance, bg, last4 = "4242" }: Props) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [0, 200], [5, -5]); // Reduced rotation range
    const rotateY = useTransform(x, [0, 320], [-5, 5]);

    function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
    }

    function handleMouseLeave() {
        x.set(160);
        y.set(100);
    }

    const background = bg || "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))";

    return (
        <div style={{ perspective: 1200 }} className="w-full h-full">
            <motion.div
                onMouseMove={handleMouse}
                onMouseLeave={handleMouseLeave}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    background,
                    transformOrigin: "center center"
                }}
                className="w-full aspect-[1.586/1] rounded-[1.5rem] p-6 text-white relative shadow-2xl border border-white/10 flex flex-col justify-between group"
            >
                {/* 3D Content Layers - Subtle depth */}
                <div style={{ transform: "translateZ(20px)" }} className="absolute inset-0 pointer-events-none rounded-[1.5rem]" />

                {/* Top Row */}
                <div style={{ transform: "translateZ(30px)" }} className="flex justify-between items-start relative z-10 pointer-events-none">
                    <span className="font-semibold tracking-wide opacity-90 text-shadow-sm">{name}</span>
                    <img src={logo} alt="logo" className="w-8 h-8 opacity-70 " />
                </div>

                {/* Chip */}
                <div style={{ transform: "translateZ(25px)" }} className="relative z-10 my-4 pointer-events-none">
                    <div className="w-11 h-8 bg-yellow-200/20 rounded-md border border-yellow-200/30 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 grid grid-cols-2 gap-[1px] bg-yellow-500/10" />
                    </div>
                </div>

                {/* Bottom Section */}
                <div style={{ transform: "translateZ(35px)" }} className="relative z-10 mt-auto pointer-events-none">
                    <div className="mb-4">
                        <span className="text-3xl font-bold tracking-tight">
                            ${balance.toLocaleString()}
                        </span>
                    </div>

                    <div className="flex justify-between items-end opacity-80">
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase tracking-wider">Account number</span>
                            <span className="font-mono tracking-widest text-sm">**** **** **** {last4}</span>
                        </div>

                    </div>
                </div>

                {/* Glossy Reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[1.5rem] mix-blend-overlay" />
            </motion.div>
        </div>
    );
}