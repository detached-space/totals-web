import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./pages/Dashboard";
import ThemeProvider from "./theme/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <div className="flex h-screen w-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="flex-1 overflow-auto">
            <Dashboard />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}