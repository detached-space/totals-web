import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppSidebar from "./components/layout/Sidebar";
import Dashboard from "./components/pages/Dashboard";
import Accounts from "./components/pages/Accounts";
import Transactions from "./components/pages/Transactions";
import People from "./components/pages/People";
import ThemeProvider from "./components/theme/ThemeProvider";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { MobileRedirect } from "./components/MobileRedirect";
import { useIsMobile } from "./hooks/use-mobile";

export default function App() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ThemeProvider>
        <MobileRedirect />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="p-3 bg-sidebar h-screen flex flex-col">
            <main className="rounded-xl bg-background flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-h-0">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/accounts" element={<Accounts />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/people" element={<People />} />
              </Routes>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </Router>
    </ThemeProvider>
  );
}
