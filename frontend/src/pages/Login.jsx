import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, ArrowRight, UserCheck, ArrowLeft } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup } = useAuth();

    // Determine initial mode based on route or state
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        if (location.pathname === '/signup') {
            setIsLogin(false);
        }
    }, [location]);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleToggle = () => {
        setIsLogin(!isLogin);
        // Reset sensitive fields
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                // Login Logic
                const user = await login(formData.email, formData.password);
                toast.success('Welcome back!');
                redirectUser(user);
            } else {
                // Register Logic
                if (formData.password !== formData.confirmPassword) {
                    toast.error("Passwords do not match");
                    return;
                }
                if (formData.password.length < 6) {
                    toast.error("Password must be at least 6 characters long");
                    return;
                }
                await signup({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
                toast.success('Verification email sent! Please check your inbox.', {
                    duration: 6000,
                });
                // Switch to login mode after successful signup
                setIsLogin(true);
            }
        } catch (error) {
            toast.error(error.message || 'Authentication failed');
        }
    };

    const redirectUser = (user) => {
        // Role-based redirection
        if (user.role === 'hostelManager') {
            navigate('/manager-dashboard');
        } else if (user.role === 'monitor') {
            navigate('/monitor-dashboard');
        } else {
            // Students go to the status checker dashboard
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* Back to Home Button */}
            <Link
                to="/"
                className="absolute top-8 left-8 flex items-center gap-3 text-gray-500 hover:text-blue-600 transition-all font-bold z-30 group"
            >
                <div className="h-10 w-10 rounded-2xl bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-translate-x-1">
                    <ArrowLeft size={20} />
                </div>
                <span className="hidden sm:inline-block text-sm uppercase tracking-widest">Back to Home</span>
            </Link>

            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] relative z-10">

                {/* Left Side - Image/Info (visible on login) or Form (visible on signup) - logic simplified to just toggle content */}

                {/* Form Section */}
                <div className={`w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center transition-all duration-500 order-2 md:order-1 ${isLogin ? 'md:translate-x-0' : 'md:translate-x-full'}`}>
                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500">
                            {isLogin ? 'Enter your details to access your account' : 'Join us and manage your hostel life'}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    required={!isLogin}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-900 placeholder:text-gray-300"
                                    required
                                />
                            </div>
                            {!isLogin && (
                                <p className="text-xs text-gray-500 ml-1">Password must be at least 6 characters long</p>
                            )}
                        </div>

                        {!isLogin && (
                            <div className="relative">
                                <UserCheck className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    required={!isLogin}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <Button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
                            {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>

                    <div className="mt-8 text-center md:hidden">
                        <p className="text-gray-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button onClick={handleToggle} className="ml-2 font-bold text-blue-600 hover:text-blue-700">
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Right Side - Info/Toggle Section */}
                <div className={`hidden md:flex w-1/2 p-12 bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex-col justify-center items-center text-center transition-all duration-500 order-1 md:order-2 ${isLogin ? 'md:translate-x-0' : 'md:-translate-x-full'}`}>
                    <div className="max-w-xs mx-auto">
                        <h3 className="text-3xl font-bold mb-4">
                            {isLogin ? "New Here?" : "One of us?"}
                        </h3>
                        <p className="mb-8 opacity-90 text-lg">
                            {isLogin
                                ? "Sign up and discover a great amount of new opportunities!"
                                : "If you already have an account, just sign in. We've missed you!"}
                        </p>
                        <button
                            onClick={handleToggle}
                            className="px-8 py-3 border-2 border-white rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105"
                        >
                            {isLogin ? "Sign Up" : "Sign In"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
