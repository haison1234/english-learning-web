// ── Payment Service ──
import { getAuthHeaders } from './authService'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export interface PaymentInitiateRequest {
  courseId: string
  method: number // 0=VNPAY, 1=MOMO, 2=BANK_CARD, 3=FREE
  couponCode?: string
}

export interface PaymentInitiateResponse {
  paymentId: string
  originalPrice: number
  discountAmount: number
  finalPrice: number
  currency: string
  paymentUrl?: string
}

export interface PaymentConfirmRequest {
  paymentId: string
  transactionRef?: string
}

export interface PaymentRecord {
  id: string
  courseId: string
  courseTitle: string
  originalPrice: number
  finalPrice: number
  method: number
  status: number // 0=PENDING, 1=SUCCESS, 2=FAILED, 3=REFUNDED
  createdAt: string
  paidAt: string | null
}

export interface CouponValidateResponse {
  valid: boolean
  discountType: number // 0=PERCENTAGE, 1=FIXED
  discountValue: number
  message: string
}

/**
 * Khởi tạo giao dịch thanh toán
 */
export async function initiatePayment(req: PaymentInitiateRequest): Promise<PaymentInitiateResponse> {
  const response = await fetch(`${API_URL}/api/v1/payments/initiate`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Không thể khởi tạo giao dịch.')
  }
  return response.json()
}

/**
 * Xác nhận thanh toán thành công (mock)
 */
export async function confirmPayment(req: PaymentConfirmRequest): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_URL}/api/v1/payments/confirm`, {
    method: 'POST',
    headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Xác nhận thanh toán thất bại.')
  }
  return response.json()
}

/**
 * Lấy lịch sử thanh toán của user
 */
export async function getMyPayments(): Promise<PaymentRecord[]> {
  const response = await fetch(`${API_URL}/api/v1/payments/my`, {
    method: 'GET',
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Không thể tải lịch sử thanh toán.')
  }
  return response.json()
}

/**
 * Validate coupon code
 */
export async function validateCoupon(
  code: string,
  courseId: string
): Promise<CouponValidateResponse> {
  const response = await fetch(
    `${API_URL}/api/v1/payments/coupon/validate?code=${encodeURIComponent(code)}&courseId=${courseId}`,
    { method: 'GET', headers: getAuthHeaders() }
  )
  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message || 'Mã coupon không hợp lệ.')
  }
  return response.json()
}
