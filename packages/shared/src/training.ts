import { Technique } from './technique';

// Core types
export interface TrainingSession {
  id: string;
  user_id: string;
  user?: string;
  date: string;
  class_time?: string;
  rolling_open_mat?: boolean;
  is_open_mat?: boolean;
  techniques?: Technique[];
  submit_using_options?: Technique[];
  tapped_by_options?: Technique[];
  duration: number; // in minutes
  notes: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

// Request types
export interface CreateTrainingRequest {
  user_id: string;
  submit_using_options_ids: string[];
  tapped_by_options_ids: string[];
  duration: number;
  notes?: string;
  date: string;
  is_open_mat: boolean;
}

export interface UpdateTrainingRequest {
  techniques_ids?: string[];
  duration?: number;
  notes?: string;
  date?: string;
  class_time?: string;
  rolling_open_mat?: boolean;
}

// Response types
export interface TrainingSessionResponse {
  training: TrainingSession;
}

export interface TrainingSessionsResponse {
  trainings: TrainingSession[];
}
