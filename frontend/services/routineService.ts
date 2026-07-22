import { GET, POST, PATCH, DELETE } from "./api";
import { 
    ClientRoutinesResponse, 
    RoutineProfile, 
    RoutineExercise, 
    CreateRoutineResponse, 
    AssignRoutineData, 
    MessageResponse 
} from "../lib/types";



export const getClientRoutines = async (): Promise<ClientRoutinesResponse> => {
    return GET<ClientRoutinesResponse>('/api/routines');
};

interface CreateRoutinePayload {
    name: string;
    description?: string;
    exercises: Omit<RoutineExercise, 'id'>[];
}
export const createRoutine = async (data: CreateRoutinePayload): Promise<CreateRoutineResponse> => {
    return POST<CreateRoutineResponse, CreateRoutinePayload>('/api/routines', data);
};

export const assignRoutineToClient = async (data: AssignRoutineData): Promise<MessageResponse> => {
    return POST<MessageResponse, AssignRoutineData>('/api/routines/assign', data);
};

export const deleteRoutine = async (routine_id: number): Promise<MessageResponse> => {
    return DELETE<MessageResponse>(`/api/routines/${routine_id}`);
};

export const unassignRoutineFromClient = async (routine_id: number, client_id: number): Promise<MessageResponse> => {
    return DELETE<MessageResponse>(`/api/routines/${routine_id}/client/${client_id}`);
};

export const editRoutine = async (routine_id: number, data: Partial<Pick<RoutineProfile, 'name' | 'description'>>): Promise<RoutineProfile> => {
    return PATCH<RoutineProfile, typeof data>(`/api/routines/${routine_id}`, data);
};

export const duplicateRoutine = async (routine_id: number): Promise<CreateRoutineResponse> => {
    return POST<CreateRoutineResponse, {}>(`/api/routines/${routine_id}/duplicate`, {});
};
