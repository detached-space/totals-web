import { useState } from "react";
import { EyeIcon, EyeOffIcon, ChevronDown } from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import logo from "../../../../assets/logo.svg";

export interface TotalBalanceCardProps {
  totalBalance: number;
  bankCount: number;
  accountCount: number;
  totalCredit: number;
  totalDebit: number;
}

export function TotalBalanceCard({
  totalBalance,
  bankCount,
  accountCount,
  totalCredit,
  totalDebit,
}: TotalBalanceCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHidden, setIsHidden] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const rotateX = useTransform(y, [0, 200], [5, -5]);
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

  function toggleVisibility() {
    setIsHidden((prev) => !prev);
  }

  const displayBalance = isHidden
    ? "******"
    : `ETB ${totalBalance.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

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
          background: "#1e40af",
          transformOrigin: "center center",
        }}
        className="w-full aspect-[1.586/1] rounded-[1.5rem] p-6 text-white relative shadow-2xl border border-white/20 flex flex-col justify-between group"
      >
        {/* Top Row */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className="flex justify-between items-start relative z-10"
        >
          <span className="font-semibold tracking-wide opacity-90 text-shadow-sm uppercase text-xs">
            TOTALS
          </span>
          <img src={logo} alt="logo" className="w-8 h-8 opacity-70" />
        </div>

        {/* Chip */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="relative z-10 my-4"
        >
          <div className="w-11 h-8 bg-gray-300/30 rounded-md border border-gray-300/40 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 grid grid-cols-2 gap-px bg-gray-500/20" />
          </div>
        </div>

        {/* Balance Section */}
        <div
          style={{ transform: "translateZ(35px)" }}
          className="relative z-10 mt-auto"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="text-3xl font-bold tracking-tight">
              {displayBalance}
            </span>
            <button
              onClick={toggleVisibility}
              className="w-6 h-6 opacity-70 hover:opacity-100 transition cursor-pointer"
            >
              {isHidden ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="flex justify-between items-end opacity-80">
            <div className="flex flex-col gap-1">
              {!isExpanded ? (
                <span className="text-xs">
                  {bankCount} {bankCount === 1 ? "Bank" : "Banks"} |{" "}
                  {accountCount} {accountCount === 1 ? "Account" : "Accounts"}
                </span>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-xs">
                    Credit: ETB{" "}
                    {totalCredit.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs">
                    Debit: ETB{" "}
                    {totalDebit.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="transition-transform duration-200"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <ChevronDown className="w-5 h-5 opacity-70 hover:opacity-100 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Glossy Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[1.5rem] mix-blend-overlay" />
      </motion.div>
    </div>
  );
}

