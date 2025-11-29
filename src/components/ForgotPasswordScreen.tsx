import { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setError("メールアドレスを入力してください");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("有効なメールアドレスを入力してください");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail()) {
      // Simulate sending password reset email
      setTimeout(() => {
        setIsSubmitted(true);
      }, 500);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mb-6"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl mb-4">メールを送信しました</h1>
            <p className="text-muted-foreground mb-2">
              {email} にパスワードリセット用のリンクを送信しました。
            </p>
            <p className="text-muted-foreground mb-8">
              メールボックスをご確認ください。
            </p>

            <button
              onClick={onBack}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              ログイン画面に戻る
            </button>

            <p className="text-muted-foreground text-sm mt-6">
              メールが届かない場合は、迷惑メールフォルダもご確認ください
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>戻る</span>
        </button>
      </motion.div>

      <div className="flex-1 flex flex-col max-w-md w-full mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl mb-2">パスワードをリセット</h1>
          <p className="text-muted-foreground">
            登録されているメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm">
              メールアドレス
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                placeholder="example@email.com"
                className="w-full bg-input-background border border-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            {error && <p className="text-destructive text-sm mt-2">{error}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
          >
            リセットリンクを送信
          </button>
        </motion.form>
      </div>
    </div>
  );
}
