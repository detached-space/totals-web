import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";

export default function Topbar() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="w-full flex justify-between items-center px-8 py-6 bg-transparent z-10">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-foreground)] tracking-tight transition-colors duration-300">Overview</h1>
                <p className="text-[var(--color-foreground)] opacity-40 text-sm transition-colors duration-300">Welcome back, Brook</p>
            </div>

            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="glass-button w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-foreground)] opacity-70 hover:opacity-100 transition-all hover:rotate-12 cursor-pointer"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>
    );
}