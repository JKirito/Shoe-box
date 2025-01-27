import axios from "axios";

const API_URL = 'http://localhost:4000/api/auth';

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

// Browser-compatible UUID generation
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const login = async (email: string, password: string): Promise<LoginResponse | null> => {
    // const response = await axios.post(`${API_URL}/login`, {email, password});
    if(email === password) {
        return {
            user: {
                email,
                role: 'buyer' // Default role for testing
            },
            token: generateUUID()
        };
    }
    return null;
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
    // TODO: Implement actual API call
    // const response = await axios.post(`${API_URL}/register`, data);
    // return response.data;
    
    // Mock implementation for testing
    return {
        user: {
            email: data.email,
            role: data.role
        },
        token: generateUUID()
    };
};

const authService = {
    login,
    register
};

export default authService;