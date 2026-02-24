import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

// Log to see if this file is even loaded
console.log('VerifyEmail.jsx file loaded');

// Fallback to empty string for relative paths if VITE_API_BASE_URL is not set
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const VerifyEmail = () => {
    console.log('VerifyEmail component rendering');
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const verificationStarted = React.useRef(false);

    useEffect(() => {
        if (verificationStarted.current) return;
        verificationStarted.current = true;

        console.log('VerifyEmail useEffect running, token:', token);
        const verifyToken = async () => {
            if (!token) {
                console.log('VerifyEmail: No token found in URL');
                setStatus('error');
                setMessage('No verification token provided. Please check your email link.');
                return;
            }

            try {
                // The backend route is /api/auth/verify-email?token=xyz
                const url = `${API_BASE_URL}/api/auth/verify-email?token=${token}`;
                console.log('VerifyEmail: Calling API:', url);
                const response = await fetch(url);
                const data = await response.json();

                if (response.ok) {
                    console.log('VerifyEmail: Success:', data.message);
                    setStatus('success');
                    setMessage(data.message);
                    toast.success('Email verified successfully!');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else if (data.message === 'Email already verified') {
                    // Treat already verified as success for smoother UX
                    console.log('VerifyEmail: Already verified, treating as success');
                    setStatus('success');
                    setMessage('Your email is already verified. Redirecting to login...');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000);
                } else {
                    console.log('VerifyEmail: Error response:', data.message);
                    setStatus('error');
                    setMessage(data.message || 'Verification failed');
                }
            } catch (error) {
                console.error('VerifyEmail: Catch block error:', error);
                setStatus('error');
                setMessage('An error occurred during verification. Please try again.');
            }
        };

        verifyToken();
    }, [token, navigate]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Direct diagnostic text */}
            <div className="text-[10px] text-gray-300 mb-4">Verification Page Active</div>

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
                {status === 'verifying' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
                        <p className="text-gray-500 text-lg">Please wait while we confirm your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Verification Successful!</h2>
                        <p className="text-gray-500 text-lg">{message}</p>
                        <p className="text-sm text-gray-400">Redirecting to login in 3 seconds...</p>
                        <div className="pt-4">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1"
                            >
                                Continue to Login <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <XCircle className="h-16 w-16 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
                        <p className="text-gray-500 text-lg">{message}</p>
                        <div className="pt-4">
                            <Link
                                to="/signup"
                                className="inline-block font-bold text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                Try signing up again
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
