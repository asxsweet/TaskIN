import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, Bell, FileText, Upload, Layers, Settings, LogOut } from "lucide-react";
import { Avatar } from "./ui/Avatar";
import { Badge } from "./ui/Badge";
import { cn } from "@/src/lib/utils";

const NAV_ITEMS = [
  { label: "Басқару тақтасы", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Іздеу", icon: Search, href: "/search" },
  { label: "Хабарландырулар", icon: Bell, href: "/notifications", badge: 3 },
];

const WORK_ITEMS = [
  { label: "Менің жұмыстарым", icon: FileText, href: "/my-works" },
  { label: "Жүктеу", icon: Upload, href: "/upload" },
  { label: "Жобалар", icon: Layers, href: "/projects" },
];

const SYSTEM_ITEMS = [
  { label: "Баптаулар", icon: Settings, href: "/settings" },
  { label: "Шығу", icon: LogOut, href: "/" },
];

export function Sidebar() {
  const location = useLocation();

  const NavLink = ({ item, key }: { item: any; key?: any }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-md transition-all group",
          isActive 
            ? "bg-primary-tint text-primary border-l-2 border-primary" 
            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon size={18} className={cn(isActive ? "text-primary" : "text-neutral-400 group-hover:text-neutral-600")} />
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        {item.badge && (
          <div className="bg-danger text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
            {item.badge}
          </div>
        )}
      </Link>
    );
  };

  return (
    <aside className="hidden md:flex w-[240px] border-r border-neutral-200 bg-white flex-col h-screen sticky top-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg">
            А
          </div>
          <span className="text-sm font-semibold tracking-tight text-neutral-900">АкадемПортал</span>
        </Link>
      </div>

      <div className="px-4 mb-8">
        <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
          <Avatar initials="АС" size="md" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-900">Айдана Серік</span>
            <Badge variant="tag" className="w-fit mt-1">Студент</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 px-3 space-y-8 overflow-y-auto">
        <div>
          <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">Негізгі</h4>
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => <NavLink key={item.href} item={item} />)}
          </div>
        </div>

        <div>
          <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">Жұмыстарым</h4>
          <div className="space-y-1">
            {WORK_ITEMS.map((item) => <NavLink key={item.href} item={item} />)}
          </div>
        </div>

        <div>
          <h4 className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-[0.1em] mb-2">Жүйе</h4>
          <div className="space-y-1">
            {SYSTEM_ITEMS.map((item) => <NavLink key={item.href} item={item} />)}
          </div>
        </div>
      </div>
    </aside>
  );
}
