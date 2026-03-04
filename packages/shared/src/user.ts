// Core types (without password for security)
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  /** Most recent belt color (e.g. "Blue Belt"). From belt progress. */
  belt_color?: string;
  /** Stripe count of the most recent belt. Used as badges in the UI. */
  belt_stripe?: number;
}

// Request types
export interface CreateUserRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

export interface CreateUserDto {
  name: string;
  username: string;
  email: string;
  password: string;
  belt_color: string;
  belt_stripe: number;
}

// Response types
export interface UserResponse {
  user: User;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
