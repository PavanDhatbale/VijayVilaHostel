import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <h1 className="text-6xl font-bold text-red-500 mb-4">403</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Access Denied</h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
                You do not have permission to view this page. Please contact the administrator if you believe this is an error.
            </p>
            <div className="flex space-x-4">
                <Button onClick={() => navigate(-1)} variant="outline">
                    Go Back
                </Button>
                <Link to="/">
                    <Button variant="primary">
                        Go Home
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
