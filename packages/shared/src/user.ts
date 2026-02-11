// Core types (without password for security)
export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  email: string;
  created_at?: Date | string;
  updated_at?: Date | string;
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

// Response types
export interface UserResponse {
  user: User;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
