import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { GraduationCap } from 'lucide-react';

const EducationDetails = ({ formData, handleChange, nextStep, prevStep }) => {
    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-blue-100 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Educational Background</h3>
                    <p className="text-gray-500">Your academic achievements and goals</p>
                </div>
            </div>

            <div className="space-y-6">
                <Input
                    label="Highest Qualification *"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    placeholder="e.g. B.Tech / B.A. / M.Com"
                    required
                />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="10th Standard Percentage *"
                        id="tenthScore"
                        name="tenthScore"
                        type="number"
                        value={formData.tenthScore || ''}
                        onChange={handleChange}
                        placeholder="85.50"
                        suffix="%"
                        required
                    />
                    <Input
                        label="12th Standard Percentage *"
                        id="twelfthScore"
                        name="twelfthScore"
                        type="number"
                        value={formData.twelfthScore || ''}
                        onChange={handleChange}
                        placeholder="78.20"
                        suffix="%"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="examFocus" className="block text-sm font-medium text-gray-700 mb-1">
                        Exam Preparation Focus *
                    </label>
                    <div className="relative">
                        <select
                            id="examFocus"
                            name="examFocus"
                            value={formData.examFocus || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                            required
                        >
                            <option value="">Select examination you are preparing for</option>
                            <option value="MPSC">MPSC (Maharashtra Public Service Commission)</option>
                            <option value="UPSC">UPSC (Union Public Service Commission)</option>
                            <option value="Police Bharati">Police Bharati</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Medical">Medical</option>
                            <option value="CA & CMA">CA & CMA</option>
                            <option value="MBA">MBA</option>
                            <option value="GOVERNMENT EXAMS">GOVERNMENT EXAMS</option>
                            <option value="OTHER">OTHER</option>
                            <option value="Both">Both MPSC & UPSC</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">Our hostel primarily supports students for MPSC & UPSC.</p>
                </div>

                <div className="flex justify-between pt-6">
                    <Button onClick={prevStep} variant="outline">
                        Back
                    </Button>
                    <Button onClick={nextStep} variant="primary" className="px-8">
                        Next Step
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EducationDetails;
