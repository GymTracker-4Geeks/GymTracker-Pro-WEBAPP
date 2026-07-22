import { ClientListItem, ClientProfileExtended, UnassignedClient, RoutineProfile, AssignedDay, RoutineAssignment, MessageResponse } from "@/lib/types"
import { GET, POST, DELETE } from "./api"

export const getUnassignedClients = async (): Promise<UnassignedClient[]> => {
    return GET<UnassignedClient[]>('/api/trainers/clients/unassigned');
};

export const assignClientToMe = async (clientId: number): Promise<{ message: string; client_id: number }> => {
    return POST<{ message: string; client_id: number }, {}>(`/api/trainers/clients/${clientId}/assign`, {});
};

export const getMyClients = async (signal?: AbortSignal): Promise<ClientListItem[]> => {
    return GET<ClientListItem[]>('/api/trainers/my-clients', signal);
};

export const getClients = async (signal?: AbortSignal): Promise<ClientProfileExtended[]> => {
    return GET<ClientProfileExtended[]>('/api/trainers/clients', signal);
};

export const getTrainerRoutines = async (signal?: AbortSignal): Promise<RoutineProfile[]> => {
    return GET<RoutineProfile[]>('/api/trainers/routines', signal);
};

export const getClientAssignedDays = async (clientId: number, signal?: AbortSignal): Promise<AssignedDay[]> => {
    return GET<AssignedDay[]>(`/api/trainers/clients/${clientId}/assigned-days`, signal);
};

export const getRoutineAssignments = async (routineId: number, signal?: AbortSignal): Promise<RoutineAssignment[]> => {
    return GET<RoutineAssignment[]>(`/api/trainers/routines/${routineId}/assignments`, signal);
};

export const unassignClient = async (clientId: number): Promise<MessageResponse> => {
    return DELETE<MessageResponse>(`/api/trainers/clients/${clientId}/unassign`);
};
