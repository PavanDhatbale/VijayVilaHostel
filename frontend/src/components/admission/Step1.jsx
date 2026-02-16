import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Step1 = ({ formData, handleChange, nextStep }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
            <Input
                label="Full Name"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
            />
            <Input
                label="Date of Birth"
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
            />

            {/* Add more fields like Gender, Nationality here */}

            <div className="flex justify-end pt-4">
                <Button onClick={nextStep} variant="primary">Next</Button>
            </div>
        </div>
    );
};

export default Step1;
