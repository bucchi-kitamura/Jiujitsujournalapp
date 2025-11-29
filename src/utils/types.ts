export interface PracticeSession {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  duration: number; // minutes
  location: string;
  instructor?: string;
  intensity: number; // 1-5
  notes?: string;
  techniques?: string[];
  challenges?: string[];
  sparringRounds?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  beltRank: string;
  joinDate: string;
  practices: PracticeSession[];
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'completed';
  startDate: string;
  completedDate?: string;
}
