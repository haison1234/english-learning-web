import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../../stores/cartStore';

const PaymentReturnPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const searchParams = location.search;
                const token = localStorage.getItem('token');
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
                
                const response = await fetch(`${apiUrl}/api/v1/payments/vnpay-return${searchParams}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();
                
                if (response.ok && data.success) {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Khóa học đã được thêm vào tài khoản của bạn.');
                    clearCart();
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Thanh toán thất bại hoặc đã bị hủy.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Có lỗi xảy ra khi xác thực thanh toán.');
            }
        };

        if (location.search) {
            verifyPayment();
        } else {
            setStatus('error');
            setMessage('Không tìm thấy thông tin giao dịch.');
        }
    }, [location.search]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg text-center">
                {status === 'loading' && (
                    <div>
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                        <h2 className="mt-6 text-2xl font-extrabold text-gray-900">Đang xử lý...</h2>
                        <p className="mt-2 text-sm text-gray-600">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Thành công!</h2>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <button
                            onClick={() => navigate('/student')}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Vào học ngay
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                            <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Thất bại</h2>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Thử lại
                            </button>
                            <button
                                onClick={() => navigate('/student')}
                                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                            >
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentReturnPage;
