export interface AuthUser {
  id: string | number;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  picture?: string;
}

export interface AuthResponse {
  success?: boolean;
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
  expiresIn?: number | string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}
