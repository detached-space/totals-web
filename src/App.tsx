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
            <Router>
                <div className="flex h-screen w-screen overflow-hidden">
                    <Sidebar />

                    <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
                        <Topbar />
                        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                            <AppRoutes />
                        </main>
                    </div>

                    {/* Ambient Background */}
                    <div className="fixed top-20 left-20 w-[500px] h-[500px] bg-blue-600/8 blur-[150px] -z-10 rounded-full pointer-events-none" />
                    <div className="fixed bottom-20 right-20 w-[400px] h-[400px] bg-purple-600/6 blur-[150px] -z-10 rounded-full pointer-events-none" />
                </div>
            </Router>
        </ThemeProvider>
    );
}
