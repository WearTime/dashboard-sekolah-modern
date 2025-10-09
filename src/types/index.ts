import { UserRole } from "@prisma/client";

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface SessionData {
  user?: SessionUser;
  isLoggedIn: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationData {
  totalPages: number;
  total: number;
  currentPage: number;
  limit: number;
}
