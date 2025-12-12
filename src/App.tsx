import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import Dashboard from "./components/pages/Dashboard";
import Accounts from "./components/pages/Accounts";
import Transactions from "./components/pages/Transactions";
import People from "./components/pages/People";
import ThemeProvider from "./components/theme/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-screen w-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative w-full h-full overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/people" element={<People />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}