import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import PageTransition from "./components/layout/PageTransition";
import Dashboard from "./components/pages/Dashboard";
import Accounts from "./components/pages/Accounts";
import Transactions from "./components/pages/Transactions";
import People from "./components/pages/People";
import Analytics from "./components/pages/Analytics";
import ActivityPage from "./components/pages/Activity";
import BudgetPage from "./components/pages/Budget";
import ThemeProvider from "./components/theme/ThemeProvider";
import PrivacyProvider from "./components/shared/PrivacyProvider";

function AppRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
                <Route path="/accounts" element={<PageTransition><Accounts /></PageTransition>} />
                <Route path="/transactions" element={<PageTransition><Transactions /></PageTransition>} />
                <Route path="/people" element={<PageTransition><People /></PageTransition>} />
                <Route path="/analytics" element={<PageTransition><Analytics /></PageTransition>} />
                <Route path="/activity" element={<PageTransition><ActivityPage /></PageTransition>} />
                <Route path="/budget" element={<PageTransition><BudgetPage /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <PrivacyProvider>
            <Router>
                <div className="noise-overlay flex h-screen w-screen overflow-hidden">
                    {/* Animated gradient mesh background */}
                    <div className="mesh-gradient" />

                    <Sidebar />

                    <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
                        <Topbar />
                        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                            <AppRoutes />
                        </main>
                    </div>
                </div>
            </Router>
            </PrivacyProvider>
        </ThemeProvider>
    );
}
