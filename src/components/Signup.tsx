import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '@/lib/features/auth/authSlice';
import authService from '@/services/authService';

type Role = 'buyer' | 'seller' | 'admin';

interface SignupForm {
    email: string;
    password: string;
    confirmPassword: string;
    role: Role;
    // Additional fields for seller
    businessName?: string;
    businessAddress?: string;
    // Additional fields for admin
    adminCode?: string;
}

const Signup = () => {
    const [formData, setFormData] = useState<SignupForm>({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer',
    });
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (formData.role === 'admin' && (!formData.adminCode || formData.adminCode.trim() === '')) {
            setError('Admin code is required');
            return false;
        }
        if (formData.role === 'seller' && (!formData.businessName || !formData.businessAddress)) {
            setError('Business details are required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const userData = await authService.register(formData);
            if (userData) {
                dispatch(setCredentials({ user: userData.user, token: userData.token }));
                switch (userData.user.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'seller':
                        navigate('/seller');
                        break;
                    case 'buyer':
                        navigate('/buyer');
                        break;
                }
            }
        } catch (error) {
            setError('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepOne = () => (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Select Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Next
            </button>
        </div>
    );

    const renderStepTwo = () => (
        <div className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            {formData.role === 'seller' && (
                <>
                    <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
                        <input
                            type="text"
                            name="businessName"
                            id="businessName"
                            required
                            value={formData.businessName || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">Business Address</label>
                        <input
                            type="text"
                            name="businessAddress"
                            id="businessAddress"
                            required
                            value={formData.businessAddress || ''}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </>
            )}
            {formData.role === 'admin' && (
                <div>
                    <label htmlFor="adminCode" className="block text-sm font-medium text-gray-700">Admin Code</label>
                    <input
                        type="text"
                        name="adminCode"
                        id="adminCode"
                        required
                        value={formData.adminCode || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            )}
            <div className="flex space-x-4">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            sign in to your account
                        </Link>
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {step === 1 ? renderStepOne() : renderStepTwo()}
                </form>
            </div>
        </div>
    );
};

export default Signup; 