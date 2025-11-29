import { motion } from "motion/react";
import { CheckCircle2, Sparkles } from "lucide-react";

interface VerificationCompleteScreenProps {
  onContinue: () => void;
}

export function VerificationCompleteScreen({
  onContinue,
}: VerificationCompleteScreenProps) {
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
          <div className="w-32 h-32 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-success" strokeWidth={2} />
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
            <Sparkles className="w-6 h-6 text-primary" fill="currentColor" />
          </motion.div>
        </motion.div>

        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl mb-3">認証完了！</h1>
          <p className="text-muted-foreground">
            メールアドレスの確認が完了しました。
            <br />
            Jiu-Jitsu Journalへようこそ！
          </p>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-primary/5 to-success/5 border border-primary/20 rounded-2xl p-6 mb-8 w-full"
        >
          <p className="text-sm text-foreground text-center">
            これから柔術の練習を記録して、
            <br />
            計画的に上達していきましょう！
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
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            はじめる
          </button>
        </motion.div>
      </div>
    </div>
  );
}
