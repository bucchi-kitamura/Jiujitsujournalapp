import { motion } from "motion/react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface EmailVerificationScreenProps {
  email: string;
  onCheckVerification: () => Promise<boolean>;
  onResendEmail: () => void;
  onVerified: () => void;
}

export function EmailVerificationScreen({
  email,
  onCheckVerification,
  onResendEmail,
  onVerified,
}: EmailVerificationScreenProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCheckVerification = async () => {
    setIsChecking(true);
    setError("");
    
    try {
      const isVerified = await onCheckVerification();
      
      if (isVerified) {
        onVerified();
      } else {
        setError("まだメールアドレスが確認されていません。メール内のリンクをタップしてください。");
      }
    } catch (err) {
      setError("確認中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full">
        {/* Email Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="mb-8 relative"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="w-12 h-12 text-primary" strokeWidth={2} />
          </div>
          {/* Decorative dot */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-success rounded-full border-4 border-background"
          />
        </motion.div>

        {/* Title and Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl mb-3">メールアドレスを確認</h1>
          <p className="text-muted-foreground mb-2">
            確認リンクを以下のメールアドレスに送信しました
          </p>
          <p className="text-foreground">{email}</p>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-4 mb-6 w-full"
        >
          <p className="text-sm text-muted-foreground">
            メール内のリンクをタップして、アカウントを有効化してください。メールが届かない場合は、迷惑メールフォルダをご確認ください。
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4 w-full"
          >
            <p className="text-sm text-destructive text-center">{error}</p>
          </motion.div>
        )}

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full space-y-3"
        >
          <button
            onClick={handleCheckVerification}
            disabled={isChecking}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                <span>確認中...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>確認済み</span>
              </>
            )}
          </button>

          <button
            onClick={onResendEmail}
            disabled={isChecking}
            className="w-full bg-transparent hover:bg-secondary text-foreground py-4 rounded-xl transition-all duration-200 border border-border active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            メールを再送信
          </button>
        </motion.div>
      </div>
    </div>
  );
}