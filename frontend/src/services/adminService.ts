// ── Admin Service Layer ──
// Tập trung toàn bộ API calls của Admin module tại đây
import { getAuthHeaders } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserAdminDTO {
  id: string;
  fullName: string;
  email: string;
  role: number; // 0: ADMIN, 1: STUDENT
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface UserHistoryDTO {
  fullName: string;
  email: string;
  enrolledCourses: Array<{
    courseTitle: string;
    enrolledAt: string;
    paymentStatus: number;
    progressDetails: unknown;
  }>;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CourseDTO {
  id: string;
  title: string;
  description: string;
  level: number;       // 0: BEGINNER, 1: INTERMEDIATE, 2: ADVANCED
  courseType: number;  // 0: FREE, 1: PREMIUM
  basePrice: number;
  thumbnailUrl: string | null;
  trailerUrl: string | null;
  status: string;      // 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonDTO {
  id: string;
  courseId: string;
  title: string;
  contentType: number; // 0: VIDEO, 1: AUDIO, 2: TEXT, 3: PDF, 4: QUIZ
  contentUrl: string | null;
  textContent: string | null;
  durationSeconds: number;
  orderIndex: number;
  preview: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailDTO extends CourseDTO {
  lessons: LessonDTO[];
}

export interface CreateCourseRequestDTO {
  title: string;
  level: number; // 0: BEGINNER, 1: INTERMEDIATE, 2: ADVANCED
  price: number;
  description: string;
  thumbnailUrl?: string;
  trailerUrl?: string;
}

export interface LessonCreateRequestDTO {
  title: string;
  contentType: number;
  contentUrl?: string;
  textContent?: string;
  durationSeconds: number;
  isPreview: boolean;
}

export interface NotificationRequestDTO {
  title: string;
  content: string;
  type: number; // 0: IN_APP, 1: EMAIL, 2: BOTH
  targetAudience: string; // 'ALL' | 'COURSE'
  courseId?: string;
}

export interface NotificationResponseDTO {
  id: string;
  title: string;
  content: string;
  type: number;
  targetAudience: string;
  courseId: string | null;
  sentAt: string;
}

export interface CouponRequestDTO {
  code?: string;
  discountValue: number;
  isPercent: boolean;
  maxUses: number;
  expiresAt: string; // ISO datetime string
}

export interface CouponResponseDTO {
  code: string;
  discountValue: number;
  isPercent: boolean;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'EXHAUSTED';
}

export interface AssignmentReportDTO {
  lessonTitle: string;
  averageScore: number;
  distribution: Record<string, number>;
  studentScores: Array<{
    studentName: string;
    score: number;
    submittedAt: string;
  }>;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getAdminUsers(page = 0, size = 10): Promise<PageResponse<UserAdminDTO>> {
  const res = await fetch(`${API_URL}/api/v1/admin/users?page=${page}&size=${size}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể tải danh sách người dùng.');
  return res.json();
}

export async function toggleUserStatus(userId: string): Promise<UserAdminDTO> {
  const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/toggle-status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể thay đổi trạng thái người dùng.');
  return res.json();
}

export async function unlockUser(userId: string): Promise<UserAdminDTO> {
  const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/unlock`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể mở khóa tài khoản.');
  return res.json();
}

export async function getUserHistory(userId: string): Promise<UserHistoryDTO> {
  const res = await fetch(`${API_URL}/api/v1/admin/users/${userId}/history`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể tải lịch sử người dùng.');
  return res.json();
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function getAdminCourses(): Promise<CourseDTO[]> {
  const res = await fetch(`${API_URL}/api/v1/courses`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể tải danh sách khóa học.');
  return res.json();
}

export async function getAdminCourseDetail(id: string): Promise<CourseDetailDTO> {
  const res = await fetch(`${API_URL}/api/v1/courses/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể tải chi tiết khóa học.');
  return res.json();
}

export async function createCourse(data: CreateCourseRequestDTO): Promise<CourseDTO> {
  const res = await fetch(`${API_URL}/api/v1/courses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể tạo khóa học.');
  }
  return res.json();
}

export async function updateCourseStatus(id: string, status: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/courses/${id}/status?status=${status}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể cập nhật trạng thái khóa học.');
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export async function createLesson(courseId: string, data: LessonCreateRequestDTO): Promise<LessonDTO> {
  const res = await fetch(`${API_URL}/api/v1/lessons/course/${courseId}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể tạo bài học.');
  }
  return res.json();
}

export async function updateLesson(lessonId: string, data: LessonCreateRequestDTO): Promise<LessonDTO> {
  const res = await fetch(`${API_URL}/api/v1/lessons/${lessonId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Không thể cập nhật bài học.');
  return res.json();
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/lessons/${lessonId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể xóa bài học.');
}

export async function reorderLessons(orders: Array<{ lessonId: string; orderIndex: number }>): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/lessons/reorder`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(orders),
  });
  if (!res.ok) throw new Error('Không thể sắp xếp bài học.');
}

// ─── File Upload ──────────────────────────────────────────────────────────────

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  const token = localStorage.getItem('accessToken');
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API_URL}/api/v1/files/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!res.ok) throw new Error('Upload file thất bại.');
  // Backend trả về filename dạng text/plain
  return res.text();
}

export function getFileUrl(filename: string): string {
  return `${API_URL}/api/v1/files/serve/${filename}`;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function sendNotification(data: NotificationRequestDTO): Promise<NotificationResponseDTO> {
  const res = await fetch(`${API_URL}/api/v1/admin/notifications/send`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Gửi thông báo thất bại.');
  }
  return res.json();
}

export async function getNotificationHistory(): Promise<NotificationResponseDTO[]> {
  const res = await fetch(`${API_URL}/api/v1/admin/notifications/history`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể tải lịch sử thông báo.');
  return res.json();
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function getAdminCoupons(): Promise<CouponResponseDTO[]> {
  const res = await fetch(`${API_URL}/api/v1/admin/coupons`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể tải danh sách mã giảm giá.');
  return res.json();
}

export async function createCoupon(data: CouponRequestDTO): Promise<CouponResponseDTO> {
  const res = await fetch(`${API_URL}/api/v1/admin/coupons`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể tạo mã giảm giá.');
  }
  return res.json();
}

export async function deleteCoupon(code: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/admin/coupons/${code}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Không thể xóa mã giảm giá.');
  }
}
// ─── Reports ─────────────────────────────────────────────────────────────────

export async function getAssignmentReport(lessonId: string): Promise<AssignmentReportDTO> {
  const res = await fetch(`${API_URL}/api/v1/reports/assignments/${lessonId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Không thể tải báo cáo bài tập.');
  return res.json();
}

export function getExportUrl(lessonId: string): string {
  return `${API_URL}/api/v1/reports/assignments/${lessonId}/export`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const LEVEL_MAP: Record<number, string> = {
  0: 'Beginner',
  1: 'Intermediate',
  2: 'Advanced',
};

export const CONTENT_TYPE_MAP: Record<number, string> = {
  0: 'VIDEO',
  1: 'AUDIO',
  2: 'TEXT',
  3: 'PDF',
  4: 'QUIZ',
};

export const CONTENT_TYPE_LABEL: Record<number, string> = {
  0: 'Video',
  1: 'Audio',
  2: 'Văn bản',
  3: 'PDF',
  4: 'Bài tập Quiz',
};
