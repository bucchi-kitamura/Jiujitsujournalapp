import { useState } from "react";
import { motion } from "motion/react";
import { Mail, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface AuthScreenProps {
  defaultTab: "login" | "signup";
  onBack: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
  onSocialLogin: (provider: "google" | "apple") => void;
  onForgotPassword: () => void;
}

export function AuthScreen({
  defaultTab,
  onBack,
  onLogin,
  onSignUp,
  onSocialLogin,
  onForgotPassword,
}: AuthScreenProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};

    if (!email) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!password) {
      newErrors.password = "パスワードを入力してください";
    } else if (password.length < 6) {
      newErrors.password = "パスワードは6文字以上で入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (validateForm()) {
      try {
        if (activeTab === "signup") {
          await onSignUp(email, password);
        } else {
          await onLogin(email, password);
        }
      } catch (error: any) {
        setServerError(error.message || `${activeTab === "signup" ? "登録" : "ログイン"}中にエラーが発生しました`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-center justify-between"
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="mb-8"
          >
            <TabsList className="w-full grid grid-cols-2 h-12 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="signup" className="rounded-lg text-base">新規登録</TabsTrigger>
              <TabsTrigger value="login" className="rounded-lg text-base">ログイン</TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Title Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-semibold mb-1">
              {activeTab === "signup" ? "アカウント作成" : "おかえりなさい"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {activeTab === "signup" 
                ? "柔術の練習記録を始めましょう" 
                : "ログインして練習記録を続けましょう"}
            </p>
          </motion.div>

          {/* Social Auth Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SocialAuthButtons isSignUp={activeTab === "signup"} onSocialLogin={onSocialLogin} />
          </motion.div>

          {/* Error Alert */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs">または</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block mb-1.5 text-sm font-medium">
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
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="example@email.com"
                  className="w-full bg-input-background border border-border rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block mb-1.5 text-sm font-medium">
                パスワード
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  placeholder="••••••••"
                  className="w-full bg-input-background border border-border rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password (Login only) */}
            {activeTab === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-primary text-sm hover:underline"
                >
                  パスワードをお忘れですか？
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] mt-2 font-semibold"
            >
              {activeTab === "signup" ? "アカウント作成" : "ログイン"}
            </button>

            {/* Terms (SignUp only) */}
            {activeTab === "signup" && (
              <p className="text-muted-foreground text-xs text-center mt-4">
                登録することで、
                <button type="button" className="text-primary hover:underline mx-1">
                  利用規約
                </button>
                と
                <button type="button" className="text-primary hover:underline mx-1">
                  プライバシーポリシー
                </button>
                に同意したものとみなされます
              </p>
            )}
          </form>
        </Tabs>
      </div>
    </div>
  );
}
