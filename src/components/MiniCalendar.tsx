import { motion } from "motion/react";

interface MiniCalendarProps {
  practiceDates?: string[];
}

export function MiniCalendar({ practiceDates = [] }: MiniCalendarProps) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const isPracticeDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return practiceDates.includes(dateStr);
  };

  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth();
  };

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm">
          {currentYear}年 {currentMonth + 1}月
        </h3>
        <span className="text-xs text-muted-foreground">
          {practiceDates.filter((d) => d.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`)).length}回練習
        </span>
      </div>

      {/* Week Days */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="text-center text-xs text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} />
        ))}
        {days.map((day, index) => {
          const hasPractice = isPracticeDay(day);
          const isTodayDate = isToday(day);

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.01 }}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-sm
                ${hasPractice ? "bg-primary text-white font-medium" : "bg-transparent text-foreground"}
                ${isTodayDate && !hasPractice ? "border-2 border-primary text-primary font-medium" : ""}
                ${isTodayDate && hasPractice ? "ring-2 ring-accent ring-offset-2 ring-offset-card" : ""}
                transition-all cursor-pointer hover:scale-110
              `}
            >
              {day}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded" />
          <span className="text-xs text-muted-foreground">練習日</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-primary rounded" />
          <span className="text-xs text-muted-foreground">今日</span>
        </div>
      </div>
    </div>
  );
}