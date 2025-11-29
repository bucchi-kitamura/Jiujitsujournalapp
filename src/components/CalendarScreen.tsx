import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Clock, List, Grid3x3 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { cn } from "./ui/utils";
import { PracticeSession } from "../utils/types";
import { BottomNav } from "./BottomNav";
import { PageHeader } from "./PageHeader";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface CalendarScreenProps {
  practices: PracticeSession[];
  onNavigateToDashboard: () => void;
  onNavigateToProfile: () => void;
  onNavigateToChallenges: () => void;
}

type ViewMode = "calendar" | "list";

export function CalendarScreen({
  practices,
  onNavigateToDashboard,
  onNavigateToProfile,
  onNavigateToChallenges,
}: CalendarScreenProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");

  // Generate calendar days
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayIndex = firstDay.getDay(); // 0 = Sunday
    
    const days = [];
    
    // Previous month padding
    for (let i = 0; i < startingDayIndex; i++) {
      days.push({ day: null, fullDate: null });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        fullDate: new Date(year, month, i)
      });
    }
    
    return days;
  }, [currentDate]);

  // Filter practices for indicators and selected view
  const getPracticesForDate = (date: Date) => {
    return practices.filter(p => {
      const pDate = new Date(p.date);
      return pDate.getDate() === date.getDate() &&
             pDate.getMonth() === date.getMonth() &&
             pDate.getFullYear() === date.getFullYear();
    });
  };

  const selectedDayPractices = useMemo(() => {
    return getPracticesForDate(selectedDate);
  }, [selectedDate, practices]);

  // Get practices for current month (for list view)
  const currentMonthPractices = useMemo(() => {
    return practices
      .filter(p => {
        const pDate = new Date(p.date);
        return pDate.getMonth() === currentDate.getMonth() &&
               pDate.getFullYear() === currentDate.getFullYear();
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [practices, currentDate]);

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <PageHeader 
        title="カレンダー"
        subtitle={new Date().toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short"
        })}
        icon={CalendarIcon}
        rightAction={
          <ToggleGroup 
            type="single" 
            value={viewMode}
            onValueChange={(value) => {
              if (value) setViewMode(value as ViewMode);
            }}
            className="border border-border rounded-lg"
          >
            <ToggleGroupItem 
              value="calendar" 
              aria-label="カレンダー表示"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Grid3x3 className="w-4 h-4" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="list" 
              aria-label="リスト表示"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <List className="w-4 h-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        }
      />

      {/* Month Navigator */}
      <div className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
        <Button variant="ghost" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <span className="text-lg font-semibold">
          {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* View Content */}
      <div className="flex-1">
        {viewMode === "calendar" ? (
          <div className="flex flex-col h-full">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2 px-4 pt-4">
              {weekDays.map((day, i) => (
                <div key={day} className={cn(
                  "text-center text-xs font-medium",
                  i === 0 ? "text-destructive" : i === 6 ? "text-blue-500" : "text-muted-foreground"
                )}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="px-4 pb-4">
              <div className="grid grid-cols-7 gap-y-4 gap-x-1">
                {calendarData.map((item, index) => {
                  if (!item.day || !item.fullDate) {
                    return <div key={`empty-${index}`} />;
                  }
                  
                  const datePractices = getPracticesForDate(item.fullDate);
                  const hasPractice = datePractices.length > 0;
                  const isSelected = selectedDate.toDateString() === item.fullDate.toDateString();
                  const isToday = new Date().toDateString() === item.fullDate.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(item.fullDate!)}
                      className="relative flex flex-col items-center justify-start h-14 pt-1 rounded-xl transition-colors"
                    >
                      <span className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all",
                        isSelected ? "bg-primary text-primary-foreground font-bold shadow-md" : 
                        isToday ? "bg-accent text-accent-foreground font-semibold border border-primary/30" : "text-foreground",
                        !isSelected && !isToday && "hover:bg-secondary/50"
                      )}>
                        {item.day}
                      </span>
                      
                      {/* Practice Indicators */}
                      <div className="flex gap-0.5 mt-1">
                        {datePractices.slice(0, 3).map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              isSelected ? "bg-primary-foreground/70" : "bg-primary"
                            )} 
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Details */}
            <div className="bg-card/50 mt-4 rounded-t-3xl p-4 shadow-[0_-4px_16px_-4px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">
                  {selectedDate.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "long" })}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {selectedDayPractices.length}件の記録
                </span>
              </div>

              <div className="space-y-3">
                {selectedDayPractices.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl">
                    <p>この日の練習記録はありません</p>
                  </div>
                ) : (
                  selectedDayPractices.map((practice) => (
                    <motion.div
                      key={practice.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background border border-border rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(practice.date).toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>{practice.duration}分</span>
                        </div>
                        {practice.intensity && (
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={cn(
                                  "w-1 h-3 rounded-full",
                                  i < practice.intensity ? "bg-primary" : "bg-secondary"
                                )} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                         <MapPin className="w-4 h-4 text-muted-foreground" />
                         {practice.location}
                         {practice.instructor && <span className="text-muted-foreground font-normal">• {practice.instructor}</span>}
                      </div>

                      {practice.techniques && practice.techniques.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {practice.techniques.map((tech, i) => (
                            <span key={i} className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-md">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {practice.notes && (
                        <p className="text-sm text-muted-foreground mt-3 pt-3 border-t border-border/50 line-clamp-2">
                          {practice.notes}
                        </p>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="p-4 space-y-3">
            {currentMonthPractices.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>この月の練習記録はありません</p>
              </div>
            ) : (
              currentMonthPractices.map((practice) => (
                <motion.div
                  key={practice.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium flex items-center gap-2">
                      <span className="text-lg">
                        {new Date(practice.date).getDate()}日
                        <span className="text-xs text-muted-foreground ml-1">
                          ({new Date(practice.date).toLocaleDateString("ja-JP", { weekday: "short" })})
                        </span>
                      </span>
                      {practice.duration > 0 && (
                        <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                          {practice.duration}分
                        </span>
                      )}
                    </div>
                    {practice.intensity && (
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "w-1 h-3 rounded-full",
                              i < practice.intensity ? "bg-primary" : "bg-secondary"
                            )} 
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{practice.location}</span>
                      {practice.instructor && (
                        <>
                          <span>•</span>
                          <span>{practice.instructor}</span>
                        </>
                      )}
                    </div>
                    
                    {practice.techniques && practice.techniques.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {practice.techniques.map((tech, i) => (
                          <span key={i} className="text-xs bg-accent/50 text-accent-foreground px-2 py-0.5 rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {practice.notes && (
                      <p className="text-sm text-muted-foreground mt-2 pt-2 border-t border-border/50 line-clamp-2">
                        {practice.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav 
        activeTab="calendar"
        onTabChange={(tab) => {
          if (tab === "home") onNavigateToDashboard();
          if (tab === "profile") onNavigateToProfile();
          if (tab === "challenges") onNavigateToChallenges();
        }}
      />
    </div>
  );
}
