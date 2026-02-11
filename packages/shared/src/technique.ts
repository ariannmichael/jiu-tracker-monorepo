// Enums
export enum Difficulty {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

export enum Category {
  Submission = 0,
  Sweep = 1,
  Pass = 2,
  Guard = 3,
  Takedown = 4,
  Defend = 5,
  SubmissionEscape = 6,
}

// Core types
export interface Technique {
  id: string;
  name: string;
  name_portuguese: string;
  description: string;
  description_portuguese: string;
  category: Category;
  difficulty: Difficulty;
}

export interface TechniqueListItem {
  id: string;
  name: string;
  name_portuguese: string;
}

// Request types
export interface CreateTechniqueRequest {
  name: string;
  name_portuguese: string;
  description: string;
  description_portuguese: string;
  category: number;
  difficulty: number;
}

export interface UpdateTechniqueRequest {
  name?: string;
  name_portuguese?: string;
  description?: string;
  description_portuguese?: string;
  category?: number;
  difficulty?: number;
}

// Response types
export interface TechniqueResponse {
  technique: Technique;
}

export interface TechniquesListResponse {
  techniques: TechniqueListItem[];
}

export interface AllTechniquesResponse {
  techniques: Technique[];
}
