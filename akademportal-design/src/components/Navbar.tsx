import * as React from "react";
import { Link } from "react-router-dom";
import { Search, Upload, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { motion, AnimatePresence } from "motion/react";

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-20">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-lg">
            А
          </div>
          <span className="text-sm font-semibold tracking-tight text-neutral-900">АкадемПортал</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/search" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors">
            <Search size={16} /> Іздеу
          </Link>
          <Link to="/upload" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors">
            <Upload size={16} /> Жүктеу
          </Link>
          <Link to="/auth" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-primary transition-colors">
            <LogIn size={16} /> Кіру
          </Link>
          <Link to="/auth?tab=register">
            <Button size="sm">Тіркелу</Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-neutral-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-neutral-200 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              <Link to="/search" className="flex items-center gap-3 text-base font-medium text-neutral-900" onClick={() => setIsOpen(false)}>
                <Search size={20} className="text-neutral-400" /> Іздеу
              </Link>
              <Link to="/upload" className="flex items-center gap-3 text-base font-medium text-neutral-900" onClick={() => setIsOpen(false)}>
                <Upload size={20} className="text-neutral-400" /> Жүктеу
              </Link>
              <Link to="/auth" className="flex items-center gap-3 text-base font-medium text-neutral-900" onClick={() => setIsOpen(false)}>
                <LogIn size={20} className="text-neutral-400" /> Кіру
              </Link>
              <Link to="/auth?tab=register" onClick={() => setIsOpen(false)}>
                <Button className="w-full">Тіркелу</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
