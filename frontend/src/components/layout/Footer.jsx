import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer id="contact" className="bg-gray-900 text-white pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center mb-6">
                            <GraduationCap className="h-8 w-8 text-blue-400 mr-2" />
                            <span className="text-2xl font-bold">Vijay Vila Hostel</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            A free hostel for financially disadvantaged students preparing for MPSC and UPSC examinations. Founded and managed by Dr. Atul Vadagavkar (MD Medicine) with a mission to support education and uplift deserving students.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center text-center">
                        <h3 className="text-lg font-bold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">Home</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">About Hostel</Link></li>
                            <li><a href="#facilities" className="text-gray-400 hover:text-blue-400 transition-colors">Facilities</a></li>
                            <li><Link to="/rules" className="text-gray-400 hover:text-blue-400 transition-colors">Rules & Regulations</Link></li>
                            <li><Link to="/gallery" className="text-gray-400 hover:text-blue-400 transition-colors">Gallery</Link></li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="flex flex-col items-center text-center">
                        <h3 className="text-lg font-bold mb-6">Contact Us</h3>
                        <ul className="space-y-4 w-full">
                            <li className="flex items-start justify-center">
                                <MapPin className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-400 text-center">
                                    Vijay Vila Hostel<br />
                                    Vidya Vikas Circle, Nashik, Maharashtra<br />
                                    India
                                </span>
                            </li>
                            <li className="flex items-center justify-center">
                                <Phone className="h-5 w-5 text-blue-500 mr-3" />
                                <span className="text-gray-400">+91 9075261460</span>
                            </li>
                            <li className="flex items-center justify-center">
                                <Mail className="h-5 w-5 text-blue-500 mr-3" />
                                <a href="mailto:contact@vijayvilahostel.org" className="text-gray-400 hover:text-blue-400">contact@vijayvilahostel@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-center items-center text-center">
                    <p className="text-gray-500 text-sm">
                        © 2026 Vijay Vila Hostel. All rights reserved. | Managed by Dr. Atul Vadagavkar (MD Medicine)
                        <br className="md:hidden" />
                        <span className="hidden md:inline"> • </span>
                        <span className="mt-2 md:mt-0 inline-block">A social initiative to empower students through education</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
