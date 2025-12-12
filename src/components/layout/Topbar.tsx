import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function Topbar() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="w-full flex justify-between items-center p-4 border-b bg-[var(--color-bg)] text-[var(--color-text)]">
            <h2 className="text-xl font-medium">Dashboard Overview</h2>
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:opacity-70 transition"
            >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>
    );
}