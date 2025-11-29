import { Home, Calendar, Target, User } from "lucide-react";
import { motion } from "motion/react";

interface BottomNavProps {
  activeTab: "home" | "calendar" | "challenges" | "profile";
  onTabChange?: (tab: "home" | "calendar" | "challenges" | "profile") => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home" as const, label: "ホーム", icon: Home },
    { id: "calendar" as const, label: "カレンダー", icon: Calendar },
    { id: "challenges" as const, label: "課題", icon: Target },
    { id: "profile" as const, label: "プロフィール", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card backdrop-blur-xl border-t border-border z-30 shadow-lg">
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className="relative flex flex-col items-center justify-center py-3 px-2 transition-colors"
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Icon
                  className={`w-5 h-5 mb-1 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`text-xs transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}