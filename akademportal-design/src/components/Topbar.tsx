import { Search, Bell, ChevronRight } from "lucide-react";
import { Avatar } from "./ui/Avatar";
import { Input } from "./ui/Input";

export function Topbar() {
  return (
    <header className="h-14 border-b border-neutral-200 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-neutral-500">
        <span className="hidden sm:inline">Басты бет</span>
        <ChevronRight size={14} className="hidden sm:inline" />
        <span className="text-neutral-900 font-medium">Басқару тақтасы</span>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative hidden md:block w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input placeholder="Іздеу..." className="pl-10 h-9 bg-neutral-50 border-none" />
        </div>
        
        <button className="relative text-neutral-400 hover:text-neutral-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-danger rounded-full border-2 border-white" />
        </button>

        <Avatar initials="АС" size="sm" className="cursor-pointer" />
      </div>
    </header>
  );
}
