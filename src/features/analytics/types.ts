export interface KPIValue {
  value: number;
  change: number;
  best?: number;
}

export interface AnalyticsData {
  kpis: {
    focusTime: KPIValue;
    tasksDone: KPIValue;
    streak: { value: number; best: number };
  };
  completionRate: {
    rate: number;
    scheduled: number;
    success: number;
  };
  focusDistribution: Array<{ day: string; deepWork: number; routine: number }>;
  habitConsistency: number[][];
  recentSessions: Array<{
    id: number;
    title: string;
    category: string;
    duration: string;
    startedAt: string;
    outcome: string;
  }>;
  peakWindow: {
    start: string;
    end: string;
    recommendedCategory: string;
  };
}
