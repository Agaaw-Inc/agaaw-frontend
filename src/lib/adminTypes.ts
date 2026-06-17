/**
 * Admin Types & Constants
 *
 * Central type definitions for the admin panel.
 * These types mirror the NestJS backend Prisma schema exactly.
 *
 * Enum values use lowercase/snake_case to match Prisma enums.
 * The backend serializes them as-is (e.g. "super_admin", "mentor_approvals").
 */

// ─── User Roles (matches Prisma `Role` enum) ────────────────
export type UserRole = "student" | "mentor" | "admin";

// ─── Admin Roles (matches Prisma `AdminRole` enum) ──────────
export type AdminRole = "super_admin" | "admin";

/**
 * Role hierarchy — higher number = more permissions.
 * Used by hasPermission() to compare roles.
 */
export const ROLE_HIERARCHY: Record<AdminRole, number> = {
  admin: 1,
  super_admin: 2,
};

// ─── Admin Modules (matches Prisma `AdminModule` enum) ──────
/**
 * All modules in the admin panel that can have individual permissions.
 * Must match the AdminModule enum in the backend Prisma schema exactly.
 */
export type AdminModule =
  | "scholarships"
  | "blogs"
  | "users"
  | "mentors"
  | "sessions"
  | "payments"
  | "notifications"
  | "countries"
  | "mentor_approvals";

export const ALL_ADMIN_MODULES: AdminModule[] = [
  "users",
  "scholarships",
  "blogs",
  "countries",
  "mentors",
  "mentor_approvals",
  "sessions",
  "payments",
  "notifications",
];

/** Human-readable labels for each module */
export const MODULE_LABELS: Record<AdminModule, string> = {
  users: "Users",
  scholarships: "Scholarships",
  blogs: "Blogs",
  countries: "Countries",
  mentors: "Mentors",
  mentor_approvals: "Mentor Approvals",
  sessions: "Sessions",
  payments: "Payments",
  notifications: "Notifications",
};

// ─── Admin Permission ───────────────────────────────────────
/** Per-module CRUD permissions for an admin (matches admin_permissions table) */
export interface AdminPermission {
  id: string;
  adminId: string;
  module: AdminModule;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

// ─── Admin Profile (matches admin_profiles + joins) ─────────
/**
 * Full admin profile as returned by the backend.
 * Includes the linked user and their permissions.
 */
export interface AdminProfile {
  id: string;
  userId: string;
  adminRole: AdminRole;
  isActive: boolean;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
  /** Joined from users table */
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string | null;
    isVerified?: boolean;
    createdAt?: string;
  };
  /** Joined from admin_permissions table */
  permissions: AdminPermission[];
  /** Joined from users table — who created this admin */
  createdBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

// ─── Authenticated Admin User ───────────────────────────────
/**
 * Represents the currently authenticated admin.
 * Built from the /auth/me response + admin profile lookup.
 */
export interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  /** The admin profile (with permissions) — fetched separately */
  adminProfile?: AdminProfile;
}

// ─── Auth Request / Response ────────────────────────────────
/** Credentials sent to the login endpoint */
export interface AdminLoginCredentials {
  email: string;
  password: string;
}

/**
 * Shape of the backend login response.
 * POST /api/auth/login → { message, user, access_token }
 * (refresh_token is set as HttpOnly cookie by the backend)
 */
export interface AuthLoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
  };
  access_token: string;
}

/**
 * Shape of the backend refresh response.
 * POST /api/auth/refresh → { access_token }
 */
export interface AuthRefreshResponse {
  access_token: string;
}

/**
 * Shape of the backend /auth/me response.
 * GET /api/auth/me → { user: { id, email, role } }
 */
export interface AuthMeResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  };
}

// ─── Auth State ─────────────────────────────────────────────
/** Shape of the admin auth context value */
export interface AdminAuthState {
  /** The currently authenticated admin, or null */
  admin: Admin | null;
  /** Whether an admin is currently authenticated */
  isAuthenticated: boolean;
  /** True while restoring session from storage on initial load */
  isLoading: boolean;
  /** Authenticate with email/password */
  login: (credentials: AdminLoginCredentials) => Promise<void>;
  /** Clear session and redirect to login */
  logout: () => void;
  /** Refetch current admin profile to sync state */
  refreshAdmin: () => Promise<void>;
}

// ─── Paginated Response ─────────────────────────────────────
/** Generic paginated response from the backend */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Dashboard Stats ────────────────────────────────────────
/** Response from GET /api/admin/dashboard/stats */
export interface DashboardStatsResponse {
  overview: {
    totalUsers: number;
    totalStudents: number;
    totalMentors: number;
    approvedMentors: number;
    pendingMentors: number;
    totalScholarships: number;
    totalBlogs: number;
  };
  roleDistribution: Record<string, number>;
  recentActivity: ActivityLog[];
  registrationStats?: { date: string; count: number }[];
}

// ─── Activity Log ───────────────────────────────────────────
/** A single activity log entry from the backend */
export interface ActivityLog {
  id: string;
  adminId: string;
  action: string;
  module: AdminModule;
  targetId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  /** Joined admin profile with user */
  admin: {
    id: string;
    adminRole: AdminRole;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

// ─── User (backend response shape) ──────────────────────────
/** User as returned by GET /api/admin/users */
export interface UserListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profileImage: string | null;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    oauthAccounts: number;
    sessions: number;
  };
}

/** Full user detail as returned by GET /api/admin/users/:id */
export interface UserDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profileImage: string | null;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  oauthAccounts: {
    provider: string;
    createdAt: string;
  }[];
  mentorProfile: {
    id: string;
    isApproved: boolean;
    isAvailable: boolean;
    currentUniversity: string | null;
  } | null;
  studentProfile: {
    id: string;
    studyLevel: string | null;
    nationality: string | null;
  } | null;
  adminProfile: {
    id: string;
    adminRole: AdminRole;
    isActive: boolean;
  } | null;
  _count: {
    sessions: number;
    oauthAccounts: number;
    blogs: number;
    savedItems: number;
  };
}

// ─── Mentor (backend response shape) ────────────────────────
/** Mentor as returned by GET /api/admin/mentors */
export interface MentorListItem {
  id: string;
  userId: string;
  currentUniversity: string | null;
  countryId: string | null;
  experienceYears: number | null;
  hourlyRate: string | null;
  bio: string | null;
  languages: string[];
  isAvailable: boolean;
  isApproved: boolean;
  approvedById: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string | null;
    isBanned: boolean;
  };
  country: {
    id: string;
    name: string;
    slug: string;
    flagImage: string | null;
  } | null;
  approvedBy: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

// ─── Query Parameter Types ──────────────────────────────────
/** Query params for GET /api/admin/users */
export interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  isVerified?: boolean;
  isBanned?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Query params for GET /api/admin/admins */
export interface AdminQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  adminRole?: AdminRole;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Query params for GET /api/admin/mentors */
export interface MentorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isApproved?: boolean;
  isAvailable?: boolean;
  countryId?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/** Query params for GET /api/admin/activity-logs */
export interface ActivityLogQueryParams {
  page?: number;
  limit?: number;
  module?: AdminModule;
  adminId?: string;
  startDate?: string; // ISO format
  endDate?: string;   // ISO format
}

// ─── Request Body Types ─────────────────────────────────────
/** Body for POST /api/admin/admins (create admin) */
export interface CreateAdminPayload {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  adminRole: AdminRole;
  permissions?: ModulePermissionPayload[];
}

/** A single module permission entry for create/update */
export interface ModulePermissionPayload {
  module: AdminModule;
  canCreate?: boolean;
  canRead?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

/** Body for PATCH /api/admin/admins/:id/permissions */
export interface UpdatePermissionsPayload {
  permissions: ModulePermissionPayload[];
}

/** Body for PATCH /api/admin/users/:id/role */
export interface ChangeUserRolePayload {
  role: UserRole;
}

/** Body for PATCH /api/admin/profile (update own profile) */
export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  password?: string;
}

// ─── Country Types ──────────────────────────────────────────
export interface CountrySection {
  id: string;
  countryId: string;
  sectionKey: string;
  content: string;
  order: number;
  updatedAt: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  flagImage: string | null;
  region: string | null;
  currency: string | null;
  language: string | null;
  tuitionCost: string | null;
  workRights: string | null;
  visaInfo: string | null;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections?: CountrySection[];
  _count?: {
    mentorProfiles: number;
    scholarships: number;
    universities: number;
  };
}

export interface CreateCountryPayload {
  name: string;
  slug: string;
  flagImage?: string;
  region?: string;
  currency?: string;
  language?: string;
  tuitionCost?: string;
  workRights?: string;
  visaInfo?: string;
  description?: string;
  isActive?: boolean;
  sections?: {
    sectionKey: string;
    content: string;
    order?: number;
  }[];
}

export interface CountryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// ─── Scholarship Types ──────────────────────────────────────
export type ScholarshipLevel = "bachelors" | "masters" | "phd" | "other";
export type Coverage = "fully_funded" | "partial" | "varies";

export interface ScholarshipFaq {
  id: string;
  scholarshipId: string;
  question: string;
  answer: string;
  order: number;
}

export interface ScholarshipCategory {
  id: string;
  name: string;
  slug: string;
}

export interface CreateScholarshipCategoryPayload {
  name: string;
  slug: string;
}

export type UpdateScholarshipCategoryPayload = Partial<CreateScholarshipCategoryPayload>;

export interface Scholarship {
  id: string;
  name: string;
  slug: string;
  provider: string;
  countryId: string;
  categoryId: string | null;
  level: ScholarshipLevel[];
  coverage: Coverage;
  deadline: string | null;
  description: string;
  benefits: string | null;
  eligibility: string | null;
  amount: string | null;
  howToApply: string;
  requiredDocuments: string;
  officialLink: string | null;
  bannerImage: string | null;
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  country?: {
    name: string;
    flagImage: string | null;
  };
  category?: {
    name: string;
  } | null;
  faqs?: ScholarshipFaq[];
}

export interface CreateScholarshipPayload {
  name: string;
  slug: string;
  provider: string;
  countryId: string;
  categoryId?: string;
  level: ScholarshipLevel[];
  coverage: Coverage;
  deadline?: string;
  description: string;
  benefits?: string;
  eligibility?: string;
  amount?: string;
  howToApply: string;
  requiredDocuments: string;
  officialLink?: string;
  bannerImage?: string;
  isActive?: boolean;
  faqs?: {
    question: string;
    answer: string;
    order?: number;
  }[];
}

export interface ScholarshipQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  countryId?: string;
  level?: ScholarshipLevel[] | ScholarshipLevel;
  coverage?: Coverage;
}

// ─── Blog Types ─────────────────────────────────────────────
export type BlogCategory = "scholarship" | "visa" | "career" | "general" | "test_prep";

export interface BlogTag {
  id: string;
  blogId: string;
  tag: string;
}

export interface Blog {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  metaDescription: string | null;
  coverImage: string | null;
  category: BlogCategory;
  readTime: number | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    profileImage?: string | null;
  };
  tags: BlogTag[];
}

export interface CreateBlogPayload {
  title: string;
  slug: string;
  content: string;
  authorId: string;
  excerpt?: string;
  metaDescription?: string;
  coverImage?: string;
  category: BlogCategory;
  readTime?: number;
  isPublished?: boolean;
  tags?: string[];
}

export type UpdateBlogPayload = Partial<CreateBlogPayload>;

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: BlogCategory;
  isPublished?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
