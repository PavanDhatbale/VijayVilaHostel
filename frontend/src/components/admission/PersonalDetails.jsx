import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { User, CheckCircle } from 'lucide-react';

const PersonalDetails = ({ formData, handleChange, nextStep }) => {
    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Personal Details</h3>
                    <p className="text-gray-500">Tell us about yourself</p>
                </div>
            </div>

            <div className="space-y-6">
                <Input
                    label="Full Name *"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name as per 10th marksheet"
                    required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Age *"
                        id="age"
                        name="age"
                        type="number"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="e.g. 21"
                        required
                    />
                    <Input
                        label="Mobile Number *"
                        id="contact"
                        name="contact"
                        type="tel"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="+91 00000 00000"
                        required
                    />
                </div>

                <Input
                    label="Email Address *"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    required
                />

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Permanent Home Address *
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your full village/city address with Pincode"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end pt-6">
                    <Button onClick={nextStep} variant="primary" className="px-8">
                        Next Step
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetails;
