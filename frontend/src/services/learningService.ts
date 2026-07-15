import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface MyCourseLearningDTO {
  courseId: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  level: number
  totalLessons: number
  completedLessons: number
  progressPercent: number
  totalTimeSpentSeconds: number
  nextLessonId: string | null
  certificateCode?: string | null
  enrolledAt: string
  lastUpdatedAt: string | null
}

export interface AttachmentDTO {
  name: string
  url: string
}

export interface LearningLessonDTO {
  id: string
  courseId: string
  title: string
  contentType: number
  contentUrl: string | null
  textContent: string | null
  attachments?: AttachmentDTO[]
  durationSeconds: number
  orderIndex: number
  preview: boolean
  progressStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  completed: boolean
  positionSeconds: number
  timeSpentSeconds: number
  lastUpdatedAt: string | null
  completedAt: string | null
}

export interface CourseLearningDTO {
  courseId: string
  title: string
  description: string | null
  thumbnailUrl: string | null
  level: number
  totalLessons: number
  completedLessons: number
  progressPercent: number
  totalTimeSpentSeconds: number
  enrolledAt: string
  lessons: LearningLessonDTO[]
}

export interface ProgressUpdateRequest {
  positionSeconds?: number
  timeSpentSeconds?: number
  completed?: boolean
}

export interface LessonProgressDTO {
  lessonId: string
  completed: boolean
  positionSeconds: number
  timeSpentSeconds: number
  lastUpdatedAt: string | null
  completedAt: string | null
  progressStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface ExerciseQuestionDTO {
  id: string
  type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'MATCHING'
  prompt: string
  options: string[] | null
  leftItems: string[] | null
  rightItems: string[] | null
  points: number
}

export interface ExerciseQuestionResultDTO {
  questionId: string
  type: 'MULTIPLE_CHOICE' | 'FILL_BLANK' | 'MATCHING'
  prompt: string
  submittedAnswer: unknown
  correctAnswer: unknown
  correct: boolean
  explanation: string
}

export interface ExerciseSubmitResponse {
  attemptId: string
  score: number
  totalQuestions: number
  correctAnswers: number
  percentage: number
  submittedAt: string
  results: ExerciseQuestionResultDTO[]
}

export interface ExerciseAttemptDTO {
  id: string
  score: number
  totalQuestions: number
  correctAnswers: number
  percentage: number
  attemptedAt: string
  results: ExerciseQuestionResultDTO[]
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...getAuthHeaders(),
      ...(init?.headers || {}),
    },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Request failed.')
  }

  return response.json()
}

export function getMyLearningCourses(): Promise<MyCourseLearningDTO[]> {
  return requestJson(`${API_URL}/api/v1/student/courses`, {
    method: 'GET',
  })
}

export function getCourseLearning(courseId: string): Promise<CourseLearningDTO> {
  return requestJson(`${API_URL}/api/v1/student/courses/${courseId}`, {
    method: 'GET',
  })
}

export function updateLessonProgress(
  courseId: string,
  lessonId: string,
  payload: ProgressUpdateRequest
): Promise<LessonProgressDTO> {
  return requestJson(`${API_URL}/api/v1/student/courses/${courseId}/lessons/${lessonId}/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function getLessonExercises(courseId: string, lessonId: string): Promise<ExerciseQuestionDTO[]> {
  return requestJson(`${API_URL}/api/v1/student/courses/${courseId}/lessons/${lessonId}/exercises`, {
    method: 'GET',
  })
}

export function submitLessonExercise(
  courseId: string,
  lessonId: string,
  answers: Record<string, unknown>
): Promise<ExerciseSubmitResponse> {
  return requestJson(`${API_URL}/api/v1/student/courses/${courseId}/lessons/${lessonId}/exercises/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers }),
  })
}

export function getExerciseAttempts(courseId: string, lessonId: string): Promise<ExerciseAttemptDTO[]> {
  return requestJson(`${API_URL}/api/v1/student/courses/${courseId}/lessons/${lessonId}/exercise-attempts`, {
    method: 'GET',
  })
}
