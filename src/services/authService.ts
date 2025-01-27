import axios from "axios";
import { randomUUID } from "crypto";

const API_URL = 'http://localhost:4000/api/auth';

export const login = async (email: string, password: string) => {
    // const response = await axios.post(`${API_URL}/login`, {email, password});
    if(email === password) {
        return {
            user: {email},
            token: randomUUID()
        }
    }
    return null;
}

export const register = async (email: string, password: string) => {
    
    return null;
}

const authService = {
    login,
    register
}

export default authService;