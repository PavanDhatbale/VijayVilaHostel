import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Step2 = ({ formData, handleChange, nextStep, prevStep }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
            <Input
                label="Course"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
            />
            <Input
                label="Year"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
            />
            <Input
                label="Department"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
            />

            <div className="flex justify-between pt-4">
                <Button onClick={prevStep} variant="secondary">Back</Button>
                <Button onClick={nextStep} variant="primary">Next</Button>
            </div>
        </div>
    );
};

export default Step2;
