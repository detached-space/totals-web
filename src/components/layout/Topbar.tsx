import { useLocation } from "react-router-dom";

export default function Topbar() {
  const { pathname } = useLocation();

  // Convert pathname to title (e.g., "/transactions" -> "Transactions")
  const title =
    pathname === "/"
      ? "Overview"
      : pathname.split("/")[1].charAt(0).toUpperCase() +
        pathname.split("/")[1].slice(1);

  return (
    <header className="flex items-center gap-4 px-6 py-4">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search - Keeping it minimal/hidden for now or could be a small icon */}
      </div>
    </header>
  );
}
