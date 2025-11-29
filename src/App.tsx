import { useState } from "react";
import { DashboardScreen } from "./components/DashboardScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { LogPracticeScreen } from "./components/LogPracticeScreen";
import { ChallengesScreen } from "./components/ChallengesScreen";
import { PracticesListScreen } from "./components/PracticesListScreen";
import { CalendarScreen } from "./components/CalendarScreen";
import { SelectItemScreen } from "./components/SelectItemScreen";
import { toast } from "sonner";
import { PracticeSession, Challenge } from "./utils/types";

type Screen = "dashboard" | "profile" | "log-practice" | "challenges" | "practices-list" | "calendar" | "select-location" | "select-technique" | "select-instructor";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
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

  // Extract unique items from practices for selection screens
  const availableInstructors = Array.from(new Set(practices.map(p => p.instructor).filter(Boolean) as string[]));
  const availableLocations = Array.from(new Set(practices.map(p => p.location).filter(Boolean) as string[]));
  const availableTechniques = Array.from(new Set(practices.flatMap(p => p.techniques || []).filter(Boolean) as string[]));

  // Selected items for log practice
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedTechnique, setSelectedTechnique] = useState<string>("");
  const [selectedInstructor, setSelectedInstructor] = useState<string>("");
  const [editingPractice, setEditingPractice] = useState<PracticeSession | undefined>();

  const handleSavePractice = (data: Omit<PracticeSession, "id">, id?: string) => {
    if (id) {
      // Update existing practice
      setPractices(prev => prev.map(p => p.id === id ? { ...data, id } : p));
      toast.success("練習を更新しました");
    } else {
      // Create new practice
      const newPractice: PracticeSession = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
      };
      setPractices(prev => [newPractice, ...prev]);
      toast.success("練習を記録しました");
    }
    
    // Clear selected items and editing state
    setSelectedLocation("");
    setSelectedTechnique("");
    setSelectedInstructor("");
    setEditingPractice(undefined);
    
    setCurrentScreen("dashboard");
  };

  const handleEditPractice = (practice: PracticeSession) => {
    setEditingPractice(practice);
    setSelectedLocation(practice.location || "");
    setSelectedTechnique(practice.techniques?.[0] || "");
    setSelectedInstructor(practice.instructor || "");
    setCurrentScreen("log-practice");
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

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
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
          onPracticeClick={handleEditPractice}
        />
      )}
      {currentScreen === "calendar" && (
        <CalendarScreen
          practices={practices}
          onNavigateToDashboard={() => setCurrentScreen("dashboard")}
          onNavigateToProfile={() => setCurrentScreen("profile")}
          onNavigateToChallenges={() => setCurrentScreen("challenges")}
          onNavigateToLogPractice={() => setCurrentScreen("log-practice")}
          onEditPractice={handleEditPractice}
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
          onBack={() => {
            // Clear selected items and editing state when going back
            setSelectedLocation("");
            setSelectedTechnique("");
            setSelectedInstructor("");
            setEditingPractice(undefined);
            setCurrentScreen("dashboard");
          }} 
          onSave={handleSavePractice}
          onSelectLocation={() => setCurrentScreen("select-location")}
          onSelectTechnique={() => setCurrentScreen("select-technique")}
          onSelectInstructor={() => setCurrentScreen("select-instructor")}
          selectedLocation={selectedLocation}
          selectedTechnique={selectedTechnique}
          selectedInstructor={selectedInstructor}
          editingPractice={editingPractice}
        />
      )}
      {currentScreen === "select-location" && (
        <SelectItemScreen
          title="場所を選択"
          items={availableLocations}
          selectedItem={selectedLocation}
          onSelect={(item) => setSelectedLocation(item)}
          onBack={() => setCurrentScreen("log-practice")}
          placeholder="場所を検索..."
        />
      )}
      {currentScreen === "select-technique" && (
        <SelectItemScreen
          title="技を選択"
          items={availableTechniques}
          selectedItem={selectedTechnique}
          onSelect={(item) => setSelectedTechnique(item)}
          onBack={() => setCurrentScreen("log-practice")}
          placeholder="技を検索..."
        />
      )}
      {currentScreen === "select-instructor" && (
        <SelectItemScreen
          title="先生を選択"
          items={availableInstructors}
          selectedItem={selectedInstructor}
          onSelect={(item) => setSelectedInstructor(item)}
          onBack={() => setCurrentScreen("log-practice")}
          placeholder="先生を検索..."
        />
      )}
      {currentScreen === "profile" && (
        <ProfileScreen onBack={() => setCurrentScreen("dashboard")} />
      )}
    </div>
  );
}