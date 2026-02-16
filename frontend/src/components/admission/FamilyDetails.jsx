import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { Users } from 'lucide-react';

const FamilyDetails = ({ formData, handleChange, nextStep, prevStep }) => {
    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-green-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Family & Financial Status</h3>
                    <p className="text-gray-500">Helping us prioritize needy students</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Father's Occupation *"
                        id="fatherOccupation"
                        name="fatherOccupation"
                        value={formData.fatherOccupation || ''}
                        onChange={handleChange}
                        placeholder="e.g. Farmer / Labourer"
                        required
                    />
                    <Input
                        label="Annual Family Income *"
                        id="annualIncome"
                        name="annualIncome"
                        type="number"
                        value={formData.annualIncome || ''}
                        onChange={handleChange}
                        placeholder="50000"
                        prefix="₹"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="financialNeed" className="block text-sm font-medium text-gray-700 mb-1">
                        Briefly describe your financial need *
                    </label>
                    <textarea
                        id="financialNeed"
                        name="financialNeed"
                        rows="4"
                        value={formData.financialNeed || ''}
                        onChange={handleChange}
                        placeholder="Explain why you need free accommodation"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        required
                    ></textarea>
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

export default FamilyDetails;
