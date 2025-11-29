import { LucideIcon } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  color: "primary" | "secondary" | "accent";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-success/10 text-success",
  accent: "bg-accent/10 text-accent",
};

export function StatsCard({ icon: Icon, label, value, unit, color }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card border border-border rounded-xl p-3 cursor-pointer"
    >
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg mb-2 ${colorMap[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </motion.div>
  );
}