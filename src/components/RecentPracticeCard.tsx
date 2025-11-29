import { motion } from "motion/react";
import { MapPin, Clock, Hash } from "lucide-react";

interface Practice {
  id: string;
  date: string;
  location: string;
  duration: number;
  techniques: string[];
  challenges: string[];
}

interface RecentPracticeCardProps {
  practice: Practice;
  delay?: number;
}

export function RecentPracticeCard({ practice, delay = 0 }: RecentPracticeCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "今日";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "昨日";
    } else {
      return date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.01 }}
      className="bg-card border border-border rounded-2xl p-4 cursor-pointer hover:border-primary/30 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="mb-1">{formatDate(practice.date)}</h3>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{practice.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{practice.duration}分</span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges */}
      {practice.challenges.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">取り組んだ課題</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {practice.challenges.map((challenge, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-lg border border-primary/20"
              >
                {challenge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Techniques */}
      <div className="flex flex-wrap gap-2">
        {practice.techniques.map((technique, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-1 bg-secondary text-secondary-foreground text-xs rounded-lg border border-border"
          >
            {technique}
          </span>
        ))}
      </div>
    </motion.div>
  );
}