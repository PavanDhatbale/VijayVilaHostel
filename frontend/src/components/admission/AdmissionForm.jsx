import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import PersonalDetails from './PersonalDetails';
import EducationDetails from './EducationDetails';
import FamilyDetails from './FamilyDetails';
import DocumentUpload from './DocumentUpload';
import { User, GraduationCap, Users, FileText, CheckCircle, ChevronRight, HelpCircle, Phone, Mail } from 'lucide-react';

const AdmissionForm = () => {
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        contact: '',
        email: '',
        address: '',
        course: '',
        year: '',
        department: '',
        tenthScore: '',
        twelfthScore: '',
        examFocus: '',
        fatherOccupation: '',
        annualIncome: '',
        financialNeed: ''
    });

    const [files, setFiles] = useState({
        tenthMarksheet: null,
        twelfthMarksheet: null,
        incomeCertificate: null,
        aadhaarCard: null
    });

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validation: Ensure all 4 documents are selected
        if (!files.tenthMarksheet || !files.twelfthMarksheet || !files.incomeCertificate || !files.aadhaarCard) {
            toast.error('Please upload all 4 required documents');
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            // Using FormData for multipart/form-data (files + JSON)
            const formPayload = new FormData();

            // Restructure data to match backend model
            const personalDetails = {
                fullName: formData.fullName,
                age: Number(formData.age),
                contact: formData.contact,
                email: formData.email,
                address: formData.address
            };
            const educationDetails = {
                course: formData.course,
                tenthScore: formData.tenthScore,
                twelfthScore: formData.twelfthScore,
                examFocus: formData.examFocus
            };
            const familyDetails = {
                fatherOccupation: formData.fatherOccupation,
                annualIncome: formData.annualIncome,
                financialNeed: formData.financialNeed
            };

            // Append details as stringified JSON (controller will parse them)
            formPayload.append('personalDetails', JSON.stringify(personalDetails));
            formPayload.append('educationDetails', JSON.stringify(educationDetails));
            formPayload.append('familyDetails', JSON.stringify(familyDetails));

            // Append files
            formPayload.append('tenthMarksheet', files.tenthMarksheet);
            formPayload.append('twelfthMarksheet', files.twelfthMarksheet);
            formPayload.append('incomeCertificate', files.incomeCertificate);
            formPayload.append('aadhaarCard', files.aadhaarCard);

            const response = await fetch(`${API_BASE_URL}/api/admission/apply`, {
                method: 'POST',
                headers: {
                    // Do NOT set Content-Type, browser will set it with boundary
                    'Authorization': `Bearer ${token}`
                },
                body: formPayload
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit application');
            }

            toast.success('Application submitted successfully with documents!');

            // Refresh profile to update global state with 'pending' status
            await refreshProfile();

            // Redirect back to Dashboard
            navigate('/dashboard');

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Personal', icon: User },
        { id: 2, title: 'Education', icon: GraduationCap },
        { id: 3, title: 'Family', icon: Users },
        { id: 4, title: 'Documents', icon: FileText },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* ... banner ... */}
            <div className="bg-blue-900 text-white py-12 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-800 opacity-50 z-0"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4">Admission Application</h1>
                    <p className="text-blue-100 text-lg">
                        Your step towards a brighter future. We provide a supportive environment for deserving students to excel in competitive exams.
                    </p>
                </div>
            </div>

            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                        <ChevronRight className="h-4 w-4 rotate-180 mr-1" /> Back to Home
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                Application Progress
                            </h2>

                            <div className="space-y-2 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100 -z-10"></div>

                                {steps.map((s) => (
                                    <div
                                        key={s.id}
                                        className={`flex items-center p-3 rounded-xl transition-all ${step === s.id
                                            ? 'bg-blue-50 text-blue-700 font-bold shadow-sm'
                                            : step > s.id
                                                ? 'text-green-600 font-medium'
                                                : 'text-gray-400'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 z-10 transition-colors ${step === s.id
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                            : step > s.id
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-gray-100 text-gray-400'
                                            }`}>
                                            {step > s.id ? (
                                                <CheckCircle className="h-5 w-5" />
                                            ) : (
                                                <s.icon className="h-5 w-5" />
                                            )}
                                        </div>
                                        <span className="text-sm">{s.title}</span>
                                        {step > s.id && (
                                            <CheckCircle className="h-4 w-4 ml-auto" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Helper Box */}
                            <div className="mt-8 bg-orange-50 rounded-xl p-4 border border-orange-100">
                                <div className="flex items-start">
                                    <HelpCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-2 flex-shrink-0" />
                                    <p className="text-xs text-orange-800 font-medium leading-relaxed">
                                        All fields marked with * are mandatory for verification.
                                    </p>
                                </div>
                            </div>

                            {/* Contact Box */}
                            <div className="mt-6 bg-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-600/20">
                                <div className="flex items-center mb-4">
                                    <Phone className="h-5 w-5 mr-2" />
                                    <span className="font-bold">Need Help?</span>
                                </div>
                                <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                                    If you face any issues during the application process, feel free to contact us.
                                </p>
                                <div className="space-y-2 text-sm font-medium">
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 opacity-70" />
                                        admissions@vijayvila.org
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 opacity-70" />
                                        +91 98765 43210
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Area */}
                    <div className="lg:w-3/4">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 min-h-[600px]">
                            {step === 1 && <PersonalDetails formData={formData} handleChange={handleChange} nextStep={nextStep} />}
                            {step === 2 && <EducationDetails formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
                            {step === 3 && <FamilyDetails formData={formData} handleChange={handleChange} nextStep={nextStep} prevStep={prevStep} />}
                            {step === 4 && <DocumentUpload formData={formData} files={files} setFiles={setFiles} handleSubmit={handleSubmit} prevStep={prevStep} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionForm;
