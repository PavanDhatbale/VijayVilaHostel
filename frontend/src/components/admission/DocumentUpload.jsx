import React, { useState, useRef } from 'react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { FileText, Upload, CheckCircle, Save, Info, X } from 'lucide-react';

const FileUpload = ({ label, id, required = false, fileName, onFileChange }) => {
    const inputRef = useRef(null);

    const handleClick = () => {
        inputRef.current.click();
    };

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && '*'}
                </label>
                {id === 'aadhaarCard' && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">For identity verification</span>}
                {id === 'incomeCertificate' && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Issued by Tehsildar office</span>}
            </div>
            <div
                onClick={handleClick}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${fileName ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                    }`}
            >
                {fileName ? (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 break-all">{fileName}</p>
                        <p className="text-xs text-green-600 mt-1 font-medium flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" /> Uploaded Successfully
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-blue-600 mb-1">Click to upload or drag & drop</p>
                        <p className="text-xs text-gray-500">PNG or JPG (Max file size 2MB)</p>
                    </div>
                )}
                <input
                    type="file"
                    className="hidden"
                    id={id}
                    ref={inputRef}
                    onChange={(e) => onFileChange(id, e)}
                    accept="image/png, image/jpeg, image/jpg"
                />
            </div>
        </div>
    );
};

const DocumentUpload = ({ formData, setFiles, files, handleSubmit, prevStep }) => {
    const [declaration, setDeclaration] = useState(false);

    const handleFileChange = (id, e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
                toast.error('Only JPG and PNG images are allowed');
                return;
            }
            // Check file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('File size should not exceed 2MB');
                return;
            }
            setFiles(prev => ({
                ...prev,
                [id]: file
            }));
        }
    };

    return (
        <div className="animate-fade-in-up">
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-purple-100 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Document Upload</h3>
                    <p className="text-gray-500">Verify your details with original documents</p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
                    <Info className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                        Please ensure all documents are clear and readable. Blurred documents may lead to application rejection.
                    </p>
                </div>

                <FileUpload
                    label="10th Standard Marksheet"
                    id="tenthMarksheet"
                    required
                    fileName={files.tenthMarksheet?.name}
                    onFileChange={handleFileChange}
                />
                <FileUpload
                    label="12th Standard Marksheet"
                    id="twelfthMarksheet"
                    required
                    fileName={files.twelfthMarksheet?.name}
                    onFileChange={handleFileChange}
                />
                <FileUpload
                    label="Valid Income Certificate"
                    id="incomeCertificate"
                    required
                    fileName={files.incomeCertificate?.name}
                    onFileChange={handleFileChange}
                />
                <FileUpload
                    label="Aadhaar Card (Front & Back)"
                    id="aadhaarCard"
                    required
                    fileName={files.aadhaarCard?.name}
                    onFileChange={handleFileChange}
                />

                <div className="mt-8 bg-blue-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex items-start">
                        <div className="flex items-center h-5 mt-1">
                            <input
                                id="declaration"
                                type="checkbox"
                                checked={declaration}
                                onChange={(e) => setDeclaration(e.target.checked)}
                                className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                        </div>
                        <div className="ml-4">
                            <label htmlFor="declaration" className="font-bold text-lg block mb-1">Declaration & Consent</label>
                            <p className="text-blue-100 text-sm leading-relaxed opacity-90">
                                I hereby declare that the information provided above is true and accurate. I understand that any discrepancy found during verification will lead to immediate cancellation of my admission and I will be liable for the consequences.
                            </p>
                        </div>
                        <div className="hidden md:block ml-auto opacity-30">
                            <CheckCircle className="h-24 w-24" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 pt-6">
                    <Button onClick={prevStep} variant="ghost" className="text-gray-500 hover:text-gray-700 w-full md:w-auto">
                        Back to Previous Step
                    </Button>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <Button variant="outline" className="w-full md:w-auto bg-white hover:bg-gray-50 border-gray-300 text-gray-700 py-3">
                            Save as Draft
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={!declaration}
                            className={`w-full md:w-auto py-3 px-8 flex items-center justify-center font-bold text-white rounded-xl shadow-lg transition-all ${declaration
                                ? 'bg-green-600 hover:bg-green-700 hover:shadow-green-500/30'
                                : 'bg-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Submit Final Application <CheckCircle className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentUpload;
