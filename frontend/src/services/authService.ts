// ── Authentication Service ──

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  role: 'GUEST' | 'STUDENT' | 'ADMIN';
  status: 'INACTIVE' | 'ACTIVE';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

/**
 * Exchanges the Google authorization code with the Spring Boot backend
 * @param code The authorization code received from Google GIS popup
 */
export async function loginWithGoogle(code: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Đăng nhập Google thất bại. Vui lòng thử lại!');
  }

  const data: AuthResponse = await response.json();
  
  // Save to local storage
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
}

/**
 * Gets the current logged-in user from localStorage
 */
export function getCurrentUser(): UserProfile | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Gets the access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken');
}

/**
 * Standard logout (clears localStorage credentials)
 */
export function logoutUser(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

/**
 * Helper function to create authenticated headers
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}
