/** Shape of the current user, mirroring the Django UserSerializer (/auth/me/). */
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  user_type: string;
  locale: string;
  phone: string;
  school: string | null;
}

/** Body returned by the /api/auth/login BFF route (refresh is kept in a cookie, not here). */
export interface LoginResponse {
  access: string;
  user: AuthUser;
}

export interface Credentials {
  email: string;
  password: string;
}
