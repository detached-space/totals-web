import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";

export default function Topbar() {
    const { theme, setTheme } = useTheme();

    return (
        <header className="w-full flex justify-between items-center px-8 py-6 bg-transparent z-10">
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
                <p className="text-white/40 text-sm">Welcome back, Brook</p>
            </div>

            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="glass-button w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:rotate-12"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>
    );
}