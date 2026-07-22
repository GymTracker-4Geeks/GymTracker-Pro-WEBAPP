import { POST, PATCH } from "./api";
import { 
    RegisterData, 
    LoginData, 
    ChangePasswordData, 
    ForgotPasswordData, 
    ResetPasswordData, 
    AuthResponse, 
    MessageResponse 
} from "../lib/types"; 

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    return POST<AuthResponse, RegisterData>('/api/auth/register', data);
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    return POST<AuthResponse, LoginData>('/api/auth/login', data);
};

export const changePassword = async (data: ChangePasswordData): Promise<MessageResponse> => {
    return PATCH<MessageResponse, ChangePasswordData>('/api/auth/change-password', data);
};

export const forgotPassword = async (data: ForgotPasswordData): Promise<MessageResponse> => {
    return POST<MessageResponse, ForgotPasswordData>('/api/auth/forgot-password', data);
};

export const resetPassword = async (data: ResetPasswordData): Promise<MessageResponse> => {
    return POST<MessageResponse, ResetPasswordData>('/api/auth/reset-password', data);
};