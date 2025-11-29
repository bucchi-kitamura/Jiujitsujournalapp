import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { AuthScreen } from "./components/AuthScreen";
import { ForgotPasswordScreen } from "./components/ForgotPasswordScreen";
import { EmailVerificationScreen } from "./components/EmailVerificationScreen";
import { VerificationCompleteScreen } from "./components/VerificationCompleteScreen";
import { DashboardScreen } from "./components/DashboardScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { OnboardingCompleteScreen } from "./components/OnboardingCompleteScreen";
import { LogPracticeScreen } from "./components/LogPracticeScreen";
import { ChallengesScreen } from "./components/ChallengesScreen";
import { PracticesListScreen } from "./components/PracticesListScreen";
import { CalendarScreen } from "./components/CalendarScreen";
import { supabase } from "./utils/supabase/client";
import { toast } from "sonner";
import { PracticeSession, Challenge } from "./utils/types";

type Screen = "welcome" | "auth-login" | "auth-signup" | "forgot-password" | "email-verification" | "verification-complete" | "dashboard" | "profile" | "onboarding" | "onboarding-complete" | "log-practice" | "challenges" | "practices-list" | "calendar";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [userEmail, setUserEmail] = useState<string>("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState<PracticeSession[]>([
    {
      id: "1",
      date: "2024-11-23T19:00:00.000Z",
      location: "道場A",
      duration: 90,
      intensity: 3,
      instructor: "山田先生",
      techniques: ["腕十字", "三角絞め"],
      challenges: ["ガードパス"],
      notes: "調子が良かった"
    },
    {
      id: "2",
      date: "2024-11-21T18:30:00.000Z",
      location: "道場A",
      duration: 120,
      intensity: 4,
      instructor: "鈴木先生",
      techniques: ["バックテイク", "絞め技"],
      challenges: ["スイープ"],
      notes: "スパーリング多め"
    },
    {
      id: "3",
      date: "2024-11-20T10:00:00.000Z",
      location: "オープンマット",
      duration: 90,
      intensity: 3,
      instructor: "山田先生",
      techniques: ["デラヒーバ", "ベリンボロ"],
      challenges: ["ガードパス", "スイープ"],
      notes: "新しい技を試した"
    },
  ]);

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: "1",
      title: "ガードパスの精度向上",
      description: "特にニースライスパスのタイミングを掴む",
      status: "active",
      startDate: "2024-11-24T10:00:00.000Z"
    },
    {
      id: "2",
      title: "腕十字のエントリー改善",
      status: "active",
      startDate: "2024-11-20T10:00:00.000Z"
    }
  ]);

  // Extract unique instructors from practices
  const availableInstructors = Array.from(new Set(practices.map(p => p.instructor).filter(Boolean) as string[]));

  // MOCK SESSION
  const createMockSession = (email: string, name?: string, beltRank?: string): Session => ({
    access_token: "mock-token",
    refresh_token: "mock-refresh-token",
    expires_in: 3600,
    token_type: "bearer",
    user: {
      id: "mock-user-id",
      aud: "authenticated",
      role: "authenticated",
      email: email,
      email_confirmed_at: new Date().toISOString(),
      phone: "",
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: { provider: "email", providers: ["email"] },
      user_metadata: { full_name: name || "Guest User", belt_rank: beltRank },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  useEffect(() => {
    // MOCK INITIALIZATION
    // Simulate checking session but default to no session to start fresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Supabase initialization disabled for mock mode
    /*
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkOnboarding(session);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkOnboarding(session);
      } else if (!loading) {
        setCurrentScreen("welcome");
      }
    });

    return () => subscription.unsubscribe();
    */
  }, []);

  const checkOnboarding = (session: Session) => {
    const { belt_rank } = session.user.user_metadata || {};
    if (belt_rank) {
      setCurrentScreen("dashboard");
    } else {
      setCurrentScreen("onboarding");
    }
    setLoading(false);
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    // MOCK LOGIN
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const mockSession = createMockSession(email, "Test User", "White Belt");
      // If you want to test onboarding flow, remove belt_rank here
      // const mockSession = createMockSession(email, "Test User");
      
      setSession(mockSession);
      
      // Check onboarding status (mock logic: if email contains "new", go to onboarding)
      if (email.includes("new")) {
         delete mockSession.user.user_metadata.belt_rank;
         checkOnboarding(mockSession);
      } else {
         // Assume returning user has done onboarding
         mockSession.user.user_metadata.belt_rank = "White Belt";
         setCurrentScreen("dashboard");
      }
      
      toast.success("ログインしました (Mock)");
    } catch (error: any) {
      console.error("Login error:", error);
      // Re-throw to be handled by the component
      throw error;
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple") => {
    // MOCK SOCIAL LOGIN
    try {
      // provider is just used for logging in mock
      const email = `user@${provider}.com`;
      const mockSession = createMockSession(email, "Social User");
      // For social login, we might assume they are new or existing. 
      // Let's treat them as new for this mock to show onboarding.
      delete mockSession.user.user_metadata.belt_rank;
      
      setSession(mockSession);
      checkOnboarding(mockSession);
      
      toast.success(`${provider === 'google' ? 'Google' : 'Apple'}でログインしました (Mock)`);
    } catch (error: any) {
      console.error("Social login error:", error);
      toast.error("ログインに失敗しました");
    }
  };

  const handleSignUp = async (email: string, password: string): Promise<void> => {
    // MOCK SIGNUP
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 50% chance of failure
    if (Math.random() < 0.5) {
      throw new Error("このメールアドレスは既に使用されています、またはシステムエラーが発生しました。");
    }

    try {
      setUserEmail(email);
      
      // Temporarily store user info for later
      const mockSession = createMockSession(email);
      setSession(mockSession);
      
      setCurrentScreen("email-verification");
    } catch (error: any) {
      console.error("Sign up error:", error);
      // Re-throw to be handled by the component
      throw error;
    }
  };

  const handleCheckVerification = async (): Promise<boolean> => {
    if (!userEmail) return false;
    // MOCK VERIFICATION CHECK
    return true;
  };

  const handleResendEmail = async () => {
    if (!userEmail) return;
    // MOCK RESEND
    toast.success("確認メールを再送しました (Mock)");
  };

  const handleVerified = () => {
    setCurrentScreen("verification-complete");
  };

  const handleContinueToDashboard = () => {
    // MOCK CONTINUE
    if (session) {
      checkOnboarding(session);
    } else {
      setCurrentScreen("auth-login");
    }
  };

  const handleOnboardingSubmit = async (data: { name: string; beltRank: string }) => {
    // MOCK ONBOARDING SUBMIT
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (session) {
        const newSession = { ...session };
        newSession.user.user_metadata = { 
          ...newSession.user.user_metadata, 
          ...data 
        };
        setSession(newSession);
      }
      setCurrentScreen("onboarding-complete");
      toast.success("プロフィールを更新しました (Mock)");
    } catch (error: any) {
      toast.error("プロフィールの更新に失敗しました", { description: error.message });
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen("dashboard");
  };

  const handleSavePractice = (data: Omit<PracticeSession, "id">) => {
    const newPractice: PracticeSession = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setPractices(prev => [newPractice, ...prev]);
    toast.success("練習を記録しました");
    setCurrentScreen("dashboard");
  };

  const handleAddChallenge = (data: { title: string; description: string }) => {
    const newChallenge: Challenge = {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      description: data.description,
      status: "active",
      startDate: new Date().toISOString(),
    };
    setChallenges(prev => [newChallenge, ...prev]);
    toast.success("課題を追加しました");
  };

  const handleToggleChallengeStatus = (id: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status === "active" ? "completed" : "active";
        const completedDate = newStatus === "completed" ? new Date().toISOString() : undefined;
        return { ...c, status: newStatus, completedDate };
      }
      return c;
    }));
  };

  const handleDeleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    toast.success("課題を削除しました");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      {currentScreen === "welcome" && (
        <WelcomeScreen onGetStarted={() => setCurrentScreen("auth-signup")} />
      )}
      {(currentScreen === "auth-login" || currentScreen === "auth-signup") && (
        <AuthScreen
          defaultTab={currentScreen === "auth-signup" ? "signup" : "login"}
          onBack={() => setCurrentScreen("welcome")}
          onSignUp={handleSignUp}
          onForgotPassword={() => setCurrentScreen("forgot-password")}
          onLogin={handleLogin}
          onSocialLogin={handleSocialLogin}
        />
      )}
      {currentScreen === "forgot-password" && (
        <ForgotPasswordScreen onBack={() => setCurrentScreen("auth-login")} />
      )}
      {currentScreen === "email-verification" && (
        <EmailVerificationScreen
          email={userEmail}
          onCheckVerification={handleCheckVerification}
          onResendEmail={handleResendEmail}
          onVerified={handleVerified}
        />
      )}
      {currentScreen === "verification-complete" && (
        <VerificationCompleteScreen onContinue={handleContinueToDashboard} />
      )}
      {currentScreen === "onboarding" && (
        <OnboardingScreen 
          onSubmit={handleOnboardingSubmit}
          initialName={session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || ""} 
        />
      )}
      {currentScreen === "onboarding-complete" && (
        <OnboardingCompleteScreen onContinue={handleOnboardingComplete} />
      )}
      {currentScreen === "dashboard" && (
        <DashboardScreen 
          onNavigateToProfile={() => setCurrentScreen("profile")}  
          onNavigateToLogPractice={() => setCurrentScreen("log-practice")}
          onNavigateToChallenges={() => setCurrentScreen("challenges")}
          onNavigateToHistory={() => setCurrentScreen("practices-list")}
          onNavigateToCalendar={() => setCurrentScreen("calendar")}
          practices={practices}
          challenges={challenges}
        />
      )}
      {currentScreen === "practices-list" && (
        <PracticesListScreen
          practices={practices}
          onBack={() => setCurrentScreen("dashboard")}
          onPracticeClick={(id) => {
            // In the future, this could open a detailed view or edit mode
            toast.info("練習記録の詳細表示は現在開発中です");
          }}
        />
      )}
      {currentScreen === "calendar" && (
        <CalendarScreen
          practices={practices}
          onNavigateToDashboard={() => setCurrentScreen("dashboard")}
          onNavigateToProfile={() => setCurrentScreen("profile")}
          onNavigateToChallenges={() => setCurrentScreen("challenges")}
        />
      )}
      {currentScreen === "challenges" && (
        <ChallengesScreen
          challenges={challenges}
          onBack={() => setCurrentScreen("dashboard")}
          onAddChallenge={handleAddChallenge}
          onToggleStatus={handleToggleChallengeStatus}
          onDelete={handleDeleteChallenge}
        />
      )}
      {currentScreen === "log-practice" && (
        <LogPracticeScreen 
          onBack={() => setCurrentScreen("dashboard")} 
          onSave={handleSavePractice}
          availableInstructors={availableInstructors}
        />
      )}
      {currentScreen === "profile" && (
        <ProfileScreen onBack={() => setCurrentScreen("dashboard")} />
      )}
    </div>
  );
}