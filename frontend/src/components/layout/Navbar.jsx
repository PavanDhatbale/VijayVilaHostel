import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, User, LogOut, Building2 } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    const [activeSection, setActiveSection] = useState('home');

    React.useEffect(() => {
        const path = location.pathname;
        const hash = location.hash.replace('#', '');

        if (path === '/students') setActiveSection('students');
        else if (path === '/gallery') setActiveSection('gallery');
        else if (path === '/') {
            if (hash) setActiveSection(hash);
            else setActiveSection('home');
        }
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNavigation = (id) => {
        setActiveSection(id);
        if (location.pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate(`/#${id}`);
        }
        setIsOpen(false);
    };

    const navLinkClass = (section) =>
        `px-3 py-2 rounded-md font-medium transition-colors duration-200 ${activeSection === section
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
        }`;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-white" strokeWidth={2.5} />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors">
                                Vijay<span className="text-blue-600">Vila</span> Hostel
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        <button onClick={() => handleNavigation('home')} className={`bg-transparent border-none cursor-pointer ${navLinkClass('home')}`}>Home</button>
                        <button onClick={() => handleNavigation('about')} className={`bg-transparent border-none cursor-pointer ${navLinkClass('about')}`}>About</button>
                        <button onClick={() => handleNavigation('facilities')} className={`bg-transparent border-none cursor-pointer ${navLinkClass('facilities')}`}>Facilities</button>
                        <Link to="/students" className={navLinkClass('students')}>Students</Link>
                        <Link to="/gallery" className={navLinkClass('gallery')}>Gallery</Link>
                        <button onClick={() => handleNavigation('contact')} className={`bg-transparent border-none cursor-pointer ${navLinkClass('contact')}`}>Contact</button>

                        {user ? (
                            <div className="flex items-center gap-4 ml-2">
                                <Link to={user.role === 'hostelManager' ? '/manager-dashboard' : user.role === 'monitor' ? '/monitor-dashboard' : '/dashboard'}>
                                    <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                                        {user.role === 'hostelManager' ? 'Manager Portal' : user.role === 'monitor' ? 'Monitor Portal' : 'Student Portal'}
                                    </Button>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-all duration-300 border border-red-100 shadow-sm group"
                                >
                                    <LogOut size={18} className="transition-transform group-hover:scale-110" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">Login</Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center sm:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <button onClick={() => handleNavigation('home')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</button>
                        <button onClick={() => handleNavigation('about')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">About</button>
                        <button onClick={() => handleNavigation('facilities')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Facilities</button>
                        <Link to="/students" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Students</Link>
                        <Link to="/gallery" onClick={() => setIsOpen(false)} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Gallery</Link>
                        <button onClick={() => handleNavigation('contact')} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contact</button>
                        {user ? (
                            <div className="space-y-3 px-2 py-3">
                                <Link
                                    to={user.role === 'hostelManager' ? '/manager-dashboard' : user.role === 'monitor' ? '/monitor-dashboard' : '/dashboard'}
                                    className="block w-full text-center px-4 py-3 rounded-xl text-base font-bold text-blue-700 bg-blue-50 border border-blue-100 shadow-sm active:scale-95 transition-all text-decoration-none"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {user.role === 'hostelManager' ? 'Manager Portal' : user.role === 'monitor' ? 'Monitor Portal' : 'Student Portal'}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-bold text-red-600 bg-red-50 border border-red-100 active:scale-95 transition-all"
                                >
                                    <LogOut size={20} />
                                    <span>Logout Account</span>
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4 flex flex-col space-y-3 px-2">
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full justify-center py-3 rounded-xl">Login</Button>
                                </Link>
                                <Link to="/signup" onClick={() => setIsOpen(false)}>
                                    <Button variant="primary" className="w-full justify-center py-3 rounded-xl shadow-md">Signup</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
