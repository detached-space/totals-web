import {
  Wallet,
  CreditCard,
  Users,
  PanelLeft,
  PanelRight,
  LayoutDashboard,
  BookOpen,
  Heart,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
  useSidebar,
} from "../ui/sidebar";
import { Button } from "../ui/button";

const nav = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Wallet, label: "Accounts", path: "/accounts" },
  { icon: CreditCard, label: "Transactions", path: "/transactions" },
  { icon: Users, label: "People", path: "/people" },
  { icon: BookOpen, label: "Docs", path: "/docs" },
];

export default function AppSidebar() {
  const location = useLocation();
  const { toggleSidebar, state } = useSidebar();

  function isActive(path: string) {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar" className="border-r-0">
      <SidebarHeader
        className={state === "collapsed" ? "px-2 py-3" : "px-4 py-4"}
      >
        {state === "expanded" ? (
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="totals."
              className="h-8 object-contain shrink-0"
            />
            <button
              onClick={toggleSidebar}
              className="ml-auto p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors shrink-0"
            >
              <PanelLeft size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img
              src={logo}
              alt="totals"
              className="h-8 w-8 object-contain shrink-0"
            />
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
            >
              <PanelRight size={16} />
            </button>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent
        className={state === "collapsed" ? "px-2 py-2" : "px-4 py-4"}
      >
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {nav.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.path)}
                    tooltip={item.label}
                    className={
                      isActive(item.path)
                        ? "text-sidebar-foreground bg-sidebar-accent"
                        : "text-sidebar-foreground/40 hover:text-sidebar-foreground/60"
                    }
                  >
                    <Link to={item.path}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter
        className={state === "collapsed" ? "px-2 pb-3" : "px-4 pb-4"}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Contact"
              className="text-sidebar-foreground/40 hover:text-sidebar-foreground/60"
            >
              <a href="mailto:spacedetached@gmail.com">
                <span>Got questions? Contact us</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Button asChild>
          <a
            href="https://jami.bio/detached"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            Support The Devs
            <Heart className="size-4 text-red-500" />
          </a>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
