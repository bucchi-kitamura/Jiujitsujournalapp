import { motion } from "motion/react";
import { CheckCircle2, Sparkles, Trophy } from "lucide-react";

interface OnboardingCompleteScreenProps {
  onContinue: () => void;
}

export function OnboardingCompleteScreen({
  onContinue,
}: OnboardingCompleteScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 0.6, 
            type: "spring", 
            bounce: 0.5,
            delay: 0.1 
          }}
          className="mb-8 relative"
        >
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
            <Trophy className="w-16 h-16 text-primary" strokeWidth={1.5} />
          </div>
          
          {/* Sparkle animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <Sparkles className="w-8 h-8 text-warning" fill="currentColor" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="absolute -bottom-2 -left-2"
          >
            <CheckCircle2 className="w-8 h-8 text-success" fill="currentColor" stroke="white" />
          </motion.div>
        </motion.div>

        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl mb-3 font-bold">準備完了！</h1>
          <p className="text-muted-foreground">
            プロフィールの設定が完了しました。
          </p>
        </motion.div>

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-secondary/30 border border-border/50 rounded-2xl p-6 mb-8 w-full"
        >
          <p className="text-foreground text-center leading-relaxed">
            さあ、あなたの柔術ジャーニーを<br/>
            記録し始めましょう。<br/>
            <span className="text-muted-foreground text-sm mt-2 block">
              日々の練習記録が、確実な上達へと繋がります。
            </span>
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-full"
        >
          <button
            onClick={onContinue}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] font-semibold text-lg"
          >
            ダッシュボードへ
          </button>
        </motion.div>
      </div>
    </div>
  );
}
