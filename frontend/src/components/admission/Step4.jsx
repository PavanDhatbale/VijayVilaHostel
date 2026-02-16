import React from 'react';
import Button from '../ui/Button';

const Step4 = ({ formData, handleSubmit, prevStep }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Review & Submit</h3>

            <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <p><strong>Full Name:</strong> {formData.fullName}</p>
                <p><strong>DOB:</strong> {formData.dob}</p>
                <p><strong>Course:</strong> {formData.course}</p>
                <p><strong>Department:</strong> {formData.department}</p>
                <p><strong>Contact:</strong> {formData.contact}</p>
            </div>

            <div className="flex justify-between pt-4">
                <Button onClick={prevStep} variant="secondary">Back</Button>
                <Button onClick={handleSubmit} variant="primary">Submit Application</Button>
            </div>
        </div>
    );
};

export default Step4;
