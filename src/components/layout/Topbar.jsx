import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";


export default function Topbar() {
    const { theme, setTheme } = useTheme();


    return (
        <header className="w-full flex justify-between items-center p-4 border-b bg-background">
            <h2 className="text-xl font-medium">Dashboard Overview</h2>
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl bg-muted hover:bg-muted/70 transition"
            >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>
    );
}