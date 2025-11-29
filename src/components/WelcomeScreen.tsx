import { motion } from "motion/react";
import { Activity } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full relative z-10">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-3xl shadow-lg shadow-primary/20"
          >
            <Activity className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-4xl mb-3 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            Jiu-Jitsu Journal
          </h1>
          <p className="text-muted-foreground text-lg">
            計画的な上達をサポート
          </p>
        </motion.div>

        {/* Feature List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6 mb-12 w-full"
        >
          {[
            {
              title: "課題を記録",
              description: "克服したい技や動きを明確に設定",
            },
            {
              title: "練習を振り返る",
              description: "日々の練習内容を詳細に記録",
            },
            {
              title: "成長を可視化",
              description: "進捗を追跡して確実にレベルアップ",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
              <div>
                <h3 className="text-[rgb(0,0,0)] mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={onGetStarted}
          className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
        >
          はじめる
        </button>
        <p className="text-center text-muted-foreground text-sm mt-4">
          アカウントを作成して練習記録を開始
        </p>
      </motion.div>
    </div>
  );
}