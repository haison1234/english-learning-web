// ── Course Service ──
import { getAuthHeaders } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface CourseDTO {
  id: string;
  title: string;
  description: string;
  level: number;       // 0: Beginner, 1: Intermediate, 2: Advanced
  courseType: number;  // 0: FREE, 1: PREMIUM
  basePrice: number;
  thumbnailUrl: string | null;
  trailerUrl: string | null;
  status: number;      // 0: DRAFT, 1: PUBLISHED, 2: ARCHIVED
  createdById: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonDTO {
  id: string;
  courseId: string;
  title: string;
  contentType: number; // 0: VIDEO, 1: AUDIO, 2: TEXT, 3: PDF
  contentUrl: string | null;
  textContent: string | null;
  durationSeconds: number;
  orderIndex: number;
  preview: boolean;    // maps to 'preview' in JSON
  createdAt: string;
  updatedAt: string;
}

export interface CourseDetailDTO extends CourseDTO {
  lessons: LessonDTO[];
}

/**
 * Fetch all published courses from the backend
 */
export async function getCourses(): Promise<CourseDTO[]> {
  const response = await fetch(`${API_URL}/api/v1/courses`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Không thể tải danh sách khóa học.');
  }

  return response.json();
}

/**
 * Fetch course details by ID
 */
export async function getCourseDetail(id: string): Promise<CourseDetailDTO> {
  const response = await fetch(`${API_URL}/api/v1/courses/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Không thể tải chi tiết khóa học.');
  }

  return response.json();
}
