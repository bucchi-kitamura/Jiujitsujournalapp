import { motion } from "motion/react";
import { Target, Calendar } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  progress: number;
  practiceSessions: number;
  lastPracticed: string;
}

interface ChallengeProgressCardProps {
  challenge: Challenge;
  delay?: number;
}

export function ChallengeProgressCard({ challenge, delay = 0 }: ChallengeProgressCardProps) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-success";
    if (progress >= 50) return "bg-primary";
    return "bg-accent";
  };

  const formatLastPracticed = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今日";
    if (diffDays === 1) return "昨日";
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.01 }}
      className="bg-card border border-border rounded-2xl p-4 cursor-pointer hover:border-primary/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-xl flex-shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="mb-1 truncate">{challenge.title}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{challenge.practiceSessions}回練習</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{formatLastPracticed(challenge.lastPracticed)}</span>
              </div>
            </div>
          </div>
        </div>
        <span className="text-sm text-muted-foreground ml-2">{challenge.progress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${challenge.progress}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className={`h-full rounded-full ${getProgressColor(challenge.progress)}`}
        />
      </div>
    </motion.div>
  );
}