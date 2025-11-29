import { motion } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell,
  MessageSquare,
  Bug,
  Star,
  LogOut,
  Trash2,
  Shield
} from "lucide-react";

interface ProfileScreenProps {
  onBack: () => void;
}

interface ProfileItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  onClick?: () => void;
  variant?: "default" | "destructive";
}

function ProfileItem({ icon, label, value, onClick, variant = "default" }: ProfileItemProps) {
  const isDestructive = variant === "destructive";
  
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-4 px-4 hover:bg-secondary/50 active:bg-secondary transition-colors"
    >
      <div className={isDestructive ? "text-destructive" : "text-muted-foreground"}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className={isDestructive ? "text-destructive" : "text-foreground"}>
          {label}
        </p>
      </div>
      {value && <p className="text-muted-foreground text-sm">{value}</p>}
      <ChevronRight className={`w-4 h-4 ${isDestructive ? "text-destructive" : "text-muted-foreground"}`} />
    </button>
  );
}

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="px-4 mb-2 text-sm text-muted-foreground uppercase tracking-wide">
        {title}
      </h3>
      <div className="bg-card border-y border-border divide-y divide-border">
        {children}
      </div>
    </div>
  );
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border z-10">
        <div className="flex items-center gap-4 px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-secondary rounded-lg transition-colors active:scale-95"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1">プロフィール</h1>
        </div>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-4 py-6"
      >
        <h2 className="text-xl mb-1">Sam</h2>
        <p className="text-sm text-muted-foreground">sam@example.com</p>
      </motion.div>

      {/* Profile Sections */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ProfileSection title="道着設定">
          <ProfileItem
            icon={<Shield className="w-5 h-5" />}
            label="道着のサイズと管理"
            onClick={() => console.log("Gi settings")}
          />
        </ProfileSection>

        <ProfileSection title="プッシュ通知">
          <ProfileItem
            icon={<Bell className="w-5 h-5" />}
            label="ウィークリー・レポート"
            value="オン"
            onClick={() => console.log("Weekly report notification")}
          />
        </ProfileSection>

        <ProfileSection title="フィードバック">
          <ProfileItem
            icon={<MessageSquare className="w-5 h-5" />}
            label="お問い合わせ"
            onClick={() => console.log("Contact")}
          />
          <ProfileItem
            icon={<Bug className="w-5 h-5" />}
            label="バグを報告する"
            onClick={() => console.log("Report bug")}
          />
          <ProfileItem
            icon={<Star className="w-5 h-5" />}
            label="アプリのレビュー"
            onClick={() => console.log("Review app")}
          />
        </ProfileSection>

        <ProfileSection title="アカウント管理">
          <ProfileItem
            icon={<LogOut className="w-5 h-5" />}
            label="ログアウト"
            onClick={() => console.log("Sign out")}
          />
          <ProfileItem
            icon={<Trash2 className="w-5 h-5" />}
            label="アカウント削除"
            variant="destructive"
            onClick={() => console.log("Delete account")}
          />
        </ProfileSection>
      </motion.div>

      {/* Bottom padding for navigation */}
      <div className="h-20" />
    </div>
  );
}