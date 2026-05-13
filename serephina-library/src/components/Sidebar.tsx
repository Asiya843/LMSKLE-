import { LayoutDashboard, Users, Settings, BookOpen, LogOut } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: "catalog", icon: BookOpen, label: "Home" },
    { id: "blog", icon: LayoutDashboard, label: "Blog" },
    { id: "notifications", icon: Users, label: "Activity" },
    { id: "account", icon: Settings, label: "Profile" },
  ];

  return (
    <aside className="w-16 bg-slate-900 flex flex-col items-center py-6 gap-8 border-r border-slate-800 transition-all duration-300">
      <div 
        onClick={() => onViewChange("catalog")}
        className="w-10 h-10 bg-serephina-pink rounded flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-all group"
      >
        <BookOpen className="w-6 h-6 text-white" />
      </div>
      
      <nav className="flex flex-col gap-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "p-3 rounded transition-all duration-200 group relative",
              currentView === item.id 
                ? "text-serephina-pink bg-serephina-pink/10" 
                : "text-vintage-text-secondary hover:text-white"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.label}
            </span>
            {currentView === item.id && (
              <motion.div 
                layoutId="active-indicator"
                className="absolute -left-3 w-1 h-5 bg-serephina-pink rounded-r-full top-1/2 -translate-y-1/2" 
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <button 
          onClick={() => onViewChange("logout")}
          className={cn(
            "p-3.5 rounded transition-colors",
            currentView === "logout" ? "text-rose-500 bg-rose-500/10" : "text-vintage-text-secondary hover:text-rose-400"
          )}
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </aside>
  );
}
