import axios from "axios";

interface LoginResponse {
    user: {
        email: string;
        role: 'admin' | 'seller' | 'buyer';
    };
    token: string;
}

interface RegisterData {
    email: string;
    password: string;
    role: 'admin' | 'seller' | 'buyer';
    businessName?: string;
    businessAddress?: string;
    adminCode?: string;
}

const CLERK_API = 'https://api.clerk.dev/v1';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

const clerkApi = axios.create({
    baseURL: CLERK_API,
    headers: {
        'Authorization': `Bearer ${CLIENT_SECRET}`,
        'Content-Type': 'application/json'
    }
});

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await clerkApi.post('/sign-ins', {
            identifier: email,
            password,
            strategy: 'password'
        });

        return {
            user: {
                email: response.data.email_address,
                role: 'buyer' // You might want to store role in user metadata
            },
            token: response.data.token
        };
    } catch (error) {
        throw new Error('Login failed');
    }
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
    try {
        const response = await clerkApi.post('/users', {
            email_address: data.email,
            password: data.password,
            metadata: {
                role: data.role,
                businessName: data.businessName,
                businessAddress: data.businessAddress
            }
        });

        return {
            user: {
                email: response.data.email_addresses[0].email_address,
                role: data.role
            },
            token: response.data.id // Clerk user ID as token
        };
    } catch (error) {
        throw new Error('Registration failed');
    }
};

const authService = {
    login,
    register
};

export default authService;