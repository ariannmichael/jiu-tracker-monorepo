export interface TopTechniqueRow {
  techniqueId: string;
  name: string;
  namePortuguese: string;
  count: number;
}

export interface AnalyticsResponse {
  id: string;
  user_id: string;
  current_streak: number;
  max_streak: number;
  total_sessions: number;
  open_mat_sessions: number;
  total_minutes: number;
  days_trained: number;
  max_minutes_in_one_day: number;
  submissions_count: number;
  tapped_by_count: number;
  win_ratio: number;
  unique_techniques_count: number;
  top_techniques: TopTechniqueRow[];
  top_win_techniques: TopTechniqueRow[];
  top_lost_techniques: TopTechniqueRow[];
  gi_sessions: number;
  nogi_sessions: number;
  category_breakdown: Record<string, number>;
  last_computed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsApiResponse {
  analytics: AnalyticsResponse | null;
}
