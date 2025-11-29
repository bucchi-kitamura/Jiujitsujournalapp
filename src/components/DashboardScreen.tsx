import { motion } from "motion/react";
import { Plus, Calendar, Target, Clock, Flame, TrendingUp, ChevronRight, ListTodo, CheckCircle2 } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { ChallengeProgressCard } from "./ChallengeProgressCard";
import { BottomNav } from "./BottomNav";
import { PageHeader } from "./PageHeader";
import { PracticeSession, Challenge } from "../utils/types";
import { useMemo } from "react";
import { Card } from "./ui/card";
import { cn } from "./ui/utils";

// Mock data for things we aren't tracking dynamically yet
const mockTopTechniques = [
  { name: "ガードパス", count: 15 },
  { name: "腕十字", count: 12 },
  { name: "三角絞め", count: 10 },
];

interface DashboardScreenProps {
  onNavigateToProfile?: () => void;
  onNavigateToLogPractice?: () => void;
  onNavigateToChallenges?: () => void;
  onNavigateToHistory?: () => void;
  onNavigateToCalendar?: () => void;
  practices?: PracticeSession[];
  challenges?: Challenge[];
}

export function DashboardScreen({ 
  onNavigateToProfile, 
  onNavigateToLogPractice,
  onNavigateToChallenges,
  onNavigateToHistory,
  onNavigateToCalendar,
  practices = [],
  challenges = []
}: DashboardScreenProps) {
  
  // Calculate Stats
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const thisMonthPractices = practices.filter(p => {
      const d = new Date(p.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;

    const totalHours = Math.round(practices.reduce((acc, p) => acc + p.duration, 0) / 60 * 10) / 10;

    // Simple streak calculation
    let currentStreak = 0;
    const sortedPractices = [...practices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedPractices.length > 0) {
      const uniqueDates = Array.from(new Set(sortedPractices.map(p => p.date.split('T')[0]))).sort().reverse();
      
      const lastPracticeDate = new Date(uniqueDates[0]);
      const today = new Date();
      today.setHours(0,0,0,0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastDateOnly = new Date(lastPracticeDate);
      lastDateOnly.setHours(0,0,0,0);

      if (lastDateOnly.getTime() === today.getTime() || lastDateOnly.getTime() === yesterday.getTime()) {
        currentStreak = 1;
        let checkDate = new Date(lastDateOnly);
        
        for (let i = 1; i < uniqueDates.length; i++) {
           checkDate.setDate(checkDate.getDate() - 1);
           const prevDateStr = checkDate.toISOString().split('T')[0];
           if (uniqueDates.includes(prevDateStr)) {
             currentStreak++;
           } else {
             break;
           }
        }
      }
    }

    return {
      thisMonthPractices,
      totalHours,
      currentStreak,
      weeklyGoalProgress: Math.min(Math.round((thisMonthPractices / 12) * 100), 100) // Mock goal of 12/month ~ 3/week
    };
  }, [practices]);

  const activeChallengesDisplay = useMemo(() => {
    return challenges
      .filter(c => c.status === "active")
      .slice(0, 3)
      .map(c => ({
        id: c.id,
        title: c.title,
        progress: 0, 
        practiceSessions: 0,
        lastPracticed: c.startDate
      }));
  }, [challenges]);

  // Week Calendar Data
  const weekDays = useMemo(() => {
    const days = [];
    const today = new Date();
    // Start from Sunday
    const currentDay = today.getDay(); // 0 (Sun) - 6 (Sat)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay);
    startOfWeek.setHours(0,0,0,0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const isToday = d.toDateString() === today.toDateString();
      
      // Check if practiced on this day
      const hasPractice = practices.some(p => p.date.split('T')[0] === dateStr);

      days.push({
        date: d,
        dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }), // S, M, T...
        dayNum: d.getDate(),
        isToday,
        hasPractice,
        isFuture: d > today && !isToday
      });
    }
    return days;
  }, [practices]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <PageHeader 
        title="Dashboard"
        subtitle={new Date().toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "short"
        })}
      />

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        
        {/* 1. This Week's Activity (Overview) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              今週の練習
            </h2>
            <span className="text-xs text-muted-foreground font-medium bg-secondary px-2 py-1 rounded-full">
              {stats.thisMonthPractices}回 / 月
            </span>
          </div>
          
          <Card className="p-4 border-border shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-muted-foreground">Weekly Goal</span>
              <span className="text-sm font-medium">3 sessions</span>
            </div>
            <div className="flex justify-between gap-2">
              {weekDays.map((day, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs text-muted-foreground font-medium">{day.dayName}</span>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border transition-all",
                    day.isToday 
                      ? "border-primary text-primary bg-primary/10 ring-2 ring-primary/20" 
                      : "border-transparent text-muted-foreground",
                    day.hasPractice && !day.isToday && "bg-primary text-primary-foreground border-primary",
                    day.hasPractice && day.isToday && "bg-primary text-primary-foreground",
                    !day.hasPractice && !day.isToday && "bg-secondary/50"
                  )}>
                    {day.hasPractice ? <CheckCircle2 className="w-5 h-5" /> : day.dayNum}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 2. Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {/* Log Practice - Big Action */}
          <button 
            onClick={onNavigateToLogPractice}
            className="col-span-2 bg-primary text-primary-foreground rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform group"
          >
            <div className="flex flex-col items-start">
              <span className="text-lg font-bold flex items-center gap-2">
                <Plus className="w-5 h-5" />
                練習を記録
              </span>
              <span className="text-xs text-primary-foreground/80 mt-1">今日の練習を記録しましょう</span>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </div>
          </button>

          {/* Challenges */}
          <button 
            onClick={onNavigateToChallenges}
            className="bg-card border border-border hover:border-primary/50 p-4 rounded-2xl flex flex-col items-start justify-between h-32 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <Target className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-foreground">課題リスト</span>
              <span className="text-xs text-muted-foreground">{activeChallengesDisplay.length}個が進行中</span>
            </div>
          </button>

          {/* History */}
          <button 
            onClick={onNavigateToHistory}
            className="bg-card border border-border hover:border-primary/50 p-4 rounded-2xl flex flex-col items-start justify-between h-32 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-foreground">
              <ListTodo className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-foreground">練習履歴</span>
              <span className="text-xs text-muted-foreground">過去の記録を確認</span>
            </div>
          </button>
        </motion.div>

        {/* 3. Stats Summary (Smaller) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
           <h2 className="text-lg font-semibold mb-3 px-2">統計サマリー</h2>
           <div className="grid grid-cols-3 gap-3">
            <StatsCard
              icon={Clock}
              label="合計時間"
              value={stats.totalHours}
              unit="h"
              color="secondary"
            />
            <StatsCard
              icon={Flame}
              label="連続"
              value={stats.currentStreak}
              unit="日"
              color="accent"
            />
             <StatsCard
              icon={TrendingUp}
              label="テクニック"
              value={mockTopTechniques[0].count}
              unit="回"
              color="primary"
            />
          </div>
        </motion.div>

        {/* 4. Active Challenges Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex items-center justify-between px-2 mb-3">
            <h2 className="text-lg font-semibold">取り組み中の課題</h2>
            <button 
              onClick={onNavigateToChallenges}
              className="text-primary text-sm font-medium hover:underline"
            >
              すべて
            </button>
          </div>
          {activeChallengesDisplay.length > 0 ? (
            <div className="space-y-3">
              {activeChallengesDisplay.map((challenge, index) => (
                <ChallengeProgressCard
                  key={challenge.id}
                  challenge={challenge}
                  delay={index * 0.1}
                />
              ))}
            </div>
          ) : (
             <div className="text-center py-8 border-2 border-dashed border-border rounded-2xl">
               <p className="text-muted-foreground text-sm">課題が設定されていません</p>
             </div>
          )}
        </motion.div>

      </div>

      {/* Bottom Navigation */}
      <BottomNav 
        activeTab="home" 
        onTabChange={(tab) => {
          if (tab === "profile" && onNavigateToProfile) {
            onNavigateToProfile();
          }
          if (tab === "calendar" && onNavigateToCalendar) {
            onNavigateToCalendar();
          }
          if (tab === "challenges" && onNavigateToChallenges) {
            onNavigateToChallenges();
          }
        }}
      />
    </div>
  );
}
