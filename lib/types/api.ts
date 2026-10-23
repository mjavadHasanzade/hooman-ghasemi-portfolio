export type SuccessResponse<T> = {
  success: true;
  data: T;
  timestamp: string;
};

export type ErrorResponse = {
  success: false;
  statusCode: number;
  message: string | string[];
  timestamp: string;
  path: string;
};

export type Locale = "en" | "fa";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AdminProfile = {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "EDITOR";
};

export type UpdateAdminProfileInput = {
  currentPassword: string;
  email?: string;
  newPassword?: string;
};

export type UpdateAdminProfileResponse = {
  profile: AdminProfile;
  tokens: AuthTokens;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};
