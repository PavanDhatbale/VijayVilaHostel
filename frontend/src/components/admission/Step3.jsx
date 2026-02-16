import React from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const Step3 = ({ formData, handleChange, nextStep, prevStep }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
            <Input
                label="Father's Name"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
            />
            <Input
                label="Contact Number"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
            />
            <Input
                label="Address"
                id="address"
                name="address"
                value={formData.address}
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

export default Step3;
