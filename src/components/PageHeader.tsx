import { ReactNode } from "react";
import { motion } from "motion/react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}

export function PageHeader({ 
  title, 
  subtitle, 
  leftAction, 
  rightAction, 
  icon: Icon 
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="px-6 py-4">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            {leftAction && <div className="pt-0.5">{leftAction}</div>}
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <h1 className="text-2xl mb-1 font-bold flex items-center gap-2">
                {Icon && <Icon className="w-6 h-6 text-primary" />}
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground text-xs uppercase tracking-wider">
                  {subtitle}
                </p>
              )}
            </motion.div>
          </div>

          {rightAction && (
            <div className="flex items-center gap-2">
              {rightAction}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
