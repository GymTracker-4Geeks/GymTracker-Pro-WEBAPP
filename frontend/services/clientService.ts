import { GET, POST, PATCH } from "./api";
import { 
    ClientProfileExtended, 
    GetTrainerResponse, 
    GetWeightResponse, 
    GetHeightResponse, 
    GetWeightsHistoryResponse, 
    UpdateHeightResponse, 
    AddWeightResponse 
} from "../lib/types";

export const getMe = async (): Promise<ClientProfileExtended> => {
    return GET<ClientProfileExtended>('/api/clients/me');
};

export const getClientTrainer = async (): Promise<GetTrainerResponse> => {
    return GET<GetTrainerResponse>('/api/clients/trainer');
};

export const getLastWeight = async (): Promise<GetWeightResponse> => {
    return GET<GetWeightResponse>('/api/clients/weight');
};

export const getClientHeight = async (): Promise<GetHeightResponse> => {
    return GET<GetHeightResponse>('/api/clients/height');
};

export const getWeightHistory = async (): Promise<GetWeightsHistoryResponse> => {
    return GET<GetWeightsHistoryResponse>('/api/clients/weights');
};

export const updateClientHeight = async (height: number): Promise<UpdateHeightResponse> => {
    return PATCH<UpdateHeightResponse, { height: number }>('/api/clients/height', { height });
};

export const addWeightRecord = async (weight: number): Promise<AddWeightResponse> => {
    return POST<AddWeightResponse, { weight: number }>('/api/clients/weight', { weight });
};
