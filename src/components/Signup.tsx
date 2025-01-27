import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '@/lib/features/auth/authSlice';
import authService from '@/services/authService';
import { Form, Input, Steps, Button, Card, message, Typography, Spin } from 'antd';
import type { Rule, RuleObject } from 'antd/es/form';
import { ShopOutlined, UserOutlined, CrownOutlined, LockOutlined, MailOutlined, ShoppingOutlined, BankOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

type Role = 'buyer' | 'seller' | 'admin';

interface SignupForm {
    email: string;
    password: string;
    confirmPassword: string;
    role: Role;
    businessName?: string;
    businessAddress?: string;
    adminCode?: string;
}

const Signup = () => {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role>('buyer');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onRoleSelect = (value: Role) => {
        setSelectedRole(value);
        form.setFieldsValue({ role: value });
    };

    const onFinish = async (values: SignupForm) => {
        setLoading(true);
        try {
            const userData = await authService.register(values);
            if (userData) {
                dispatch(setCredentials({ user: userData.user, token: userData.token }));
                message.success('Welcome to our 3D Shoe Store!');
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
            message.error('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        {
            title: 'Choose Role',
            content: (
                <div className="flex flex-col items-center py-6">
                    <Title level={4} className="text-indigo-800 mb-6">Select your role</Title>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl px-4">
                        <Card
                            hoverable
                            className={`cursor-pointer transition-all duration-200 ${
                                selectedRole === 'buyer' 
                                    ? 'border-indigo-500 border-2 shadow-md bg-indigo-50/50' 
                                    : 'hover:border-indigo-300 hover:shadow'
                            }`}
                            onClick={() => onRoleSelect('buyer')}
                            bodyStyle={{ padding: '24px 16px' }}
                        >
                            <div className="text-center space-y-3">
                                <div className="flex justify-center">
                                    <div className={`p-3 rounded-full ${selectedRole === 'buyer' ? 'bg-indigo-100' : 'bg-gray-50'}`}>
                                        <ShoppingOutlined className="text-3xl text-indigo-500" />
                                    </div>
                                </div>
                                <Title level={5} className="!mb-1">Shoe Lover</Title>
                                <Text className="block text-gray-600 text-sm">
                                    Shop 3D-printed shoes
                                </Text>
                            </div>
                        </Card>
                        <Card
                            hoverable
                            className={`cursor-pointer transition-all duration-200 ${
                                selectedRole === 'seller' 
                                    ? 'border-indigo-500 border-2 shadow-md bg-indigo-50/50' 
                                    : 'hover:border-indigo-300 hover:shadow'
                            }`}
                            onClick={() => onRoleSelect('seller')}
                            bodyStyle={{ padding: '24px 16px' }}
                        >
                            <div className="text-center space-y-3">
                                <div className="flex justify-center">
                                    <div className={`p-3 rounded-full ${selectedRole === 'seller' ? 'bg-indigo-100' : 'bg-gray-50'}`}>
                                        <ShopOutlined className="text-3xl text-indigo-500" />
                                    </div>
                                </div>
                                <Title level={5} className="!mb-1">Designer</Title>
                                <Text className="block text-gray-600 text-sm">
                                    Sell your designs
                                </Text>
                            </div>
                        </Card>
                        <Card
                            hoverable
                            className={`cursor-pointer transition-all duration-200 ${
                                selectedRole === 'admin' 
                                    ? 'border-indigo-500 border-2 shadow-md bg-indigo-50/50' 
                                    : 'hover:border-indigo-300 hover:shadow'
                            }`}
                            onClick={() => onRoleSelect('admin')}
                            bodyStyle={{ padding: '24px 16px' }}
                        >
                            <div className="text-center space-y-3">
                                <div className="flex justify-center">
                                    <div className={`p-3 rounded-full ${selectedRole === 'admin' ? 'bg-indigo-100' : 'bg-gray-50'}`}>
                                        <CrownOutlined className="text-3xl text-indigo-500" />
                                    </div>
                                </div>
                                <Title level={5} className="!mb-1">Admin</Title>
                                <Text className="block text-gray-600 text-sm">
                                    Manage platform
                                </Text>
                            </div>
                        </Card>
                    </div>
                    <div className="mt-8">
                        <Button 
                            type="primary" 
                            size="large" 
                            onClick={() => setCurrentStep(1)}
                            className="h-11 px-10 text-base bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:from-indigo-600 hover:to-purple-700 shadow-sm"
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            title: 'Details',
            content: (
                <div className="w-full max-w-md mx-auto py-6 px-4">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{ role: selectedRole }}
                        className="space-y-4"
                    >
                        <Form.Item name="role" hidden>
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: 'Please input your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                        >
                            <Input 
                                prefix={<MailOutlined className="text-gray-400" />} 
                                placeholder="Email" 
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                { required: true, message: 'Please input your password!' },
                                { min: 6, message: 'Password must be at least 6 characters!' }
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined className="text-gray-400" />} 
                                placeholder="Password" 
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            rules={[
                                { required: true, message: 'Please confirm your password!' },
                                ({ getFieldValue }) => ({
                                    validator(rule: RuleObject, value: string) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined className="text-gray-400" />} 
                                placeholder="Confirm Password" 
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>

                        {selectedRole === 'seller' && (
                            <>
                                <Form.Item
                                    name="businessName"
                                    rules={[{ required: true, message: 'Please input your business name!' }]}
                                >
                                    <Input 
                                        prefix={<BankOutlined className="text-gray-400" />} 
                                        placeholder="Business Name" 
                                        size="large"
                                        className="rounded-lg"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="businessAddress"
                                    rules={[{ required: true, message: 'Please input your business address!' }]}
                                >
                                    <Input 
                                        prefix={<HomeOutlined className="text-gray-400" />} 
                                        placeholder="Business Address" 
                                        size="large"
                                        className="rounded-lg"
                                    />
                                </Form.Item>
                            </>
                        )}

                        {selectedRole === 'admin' && (
                            <Form.Item
                                name="adminCode"
                                rules={[{ required: true, message: 'Please input admin code!' }]}
                            >
                                <Input 
                                    prefix={<CrownOutlined className="text-gray-400" />} 
                                    placeholder="Admin Code" 
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        )}

                        <div className="flex justify-between space-x-4 pt-6">
                            <Button 
                                onClick={() => setCurrentStep(0)}
                                size="large"
                                className="h-11 px-8 min-w-[100px]"
                            >
                                Back
                            </Button>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                size="large"
                                className="h-11 px-8 min-w-[160px] bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:from-indigo-600 hover:to-purple-700 shadow-sm"
                            >
                                Create Account
                            </Button>
                        </div>
                    </Form>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <Title level={3} className="!mb-3 !text-2xl md:!text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Join Our 3D Shoe Store
                    </Title>
                    <Text className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                            Sign in
                        </Link>
                    </Text>
                </div>

                <Card className="shadow-lg rounded-xl overflow-hidden bg-white/95">
                    <Steps 
                        current={currentStep} 
                        className="mb-6 px-6"
                        items={[
                            {
                                title: 'Choose Role',
                                icon: <UserOutlined />
                            },
                            {
                                title: 'Account Details',
                                icon: <LockOutlined />
                            }
                        ]}
                    />
                    <Spin spinning={loading}>
                        {steps[currentStep].content}
                    </Spin>
                </Card>
            </div>
        </div>
    );
};

export default Signup; 