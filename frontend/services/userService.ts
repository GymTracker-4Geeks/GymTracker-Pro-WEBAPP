import { GET, PATCH } from "./api";
import { 
    UpdateRoleResponse,
    UserProfile,
    UsersResponse,
} from "../lib/types";

export const getMe = async (): Promise<UserProfile> => {
    return GET<UserProfile>('/api/clients/me');
};

export const getRole = async (): Promise<string> => {
    return GET<string>('/api/admins/my-role');
};

export const getUsers = async (page: number = 1, perPage: number = 20, search: string = ""): Promise<UsersResponse> => {
    return GET<UsersResponse>(
        `/api/admins/users?page=${page}&per_page=${perPage}&search=${encodeURIComponent(search)}`);
};

export const updateUserRole = async (userId: number, role: string): Promise<UpdateRoleResponse> => {
    return PATCH<UpdateRoleResponse>(`/api/admins/users/${userId}/role`,{role,});
};

export const changeName = async (fullName: string): Promise<any> => {
    return PATCH<any>('/api/profiles/change-name', { full_name: fullName })
};