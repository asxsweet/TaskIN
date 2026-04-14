import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Search, Upload, FileText, User } from "lucide-react";
import { cn } from "@/src/lib/utils";

const MOBILE_NAV_ITEMS = [
  { label: "Басты", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Іздеу", icon: Search, href: "/search" },
  { label: "Жүктеу", icon: Upload, href: "/upload" },
  { label: "Жұмыстарым", icon: FileText, href: "/my-works" },
  { label: "Профиль", icon: User, href: "/settings" },
];

export function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-3 flex items-center justify-between z-50">
      {MOBILE_NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-primary" : "text-neutral-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
