// ── Student Notification Service ──

import { getAuthHeaders } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface StudentNotificationDTO {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/**
 * Fetch all notifications for the current student
 */
export async function getStudentNotifications(): Promise<StudentNotificationDTO[]> {
  const response = await fetch(`${API_URL}/api/v1/student/notifications`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Không thể tải thông báo.');
  }
  return response.json();
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/student/notifications/${id}/read`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Không thể đánh dấu đã đọc.');
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  const response = await fetch(`${API_URL}/api/v1/student/notifications/read-all`, {
    method: 'PUT',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Không thể đánh dấu tất cả đã đọc.');
  }
}
