import { ClientListItem, UnassignedClient, RoutineProfile } from "@/lib/types"
import { GET, POST } from "./api"

export const getUnassignedClients = async (): Promise<UnassignedClient[]> => {
    return GET<UnassignedClient[]>('/api/trainers/clients/unassigned');
};

export const assignClientToMe = async (clientId: number): Promise<{ message: string; client_id: number }> => {
    return POST<{ message: string; client_id: number }, {}>(`/api/trainers/clients/${clientId}/assign`, {});
};

export const getMyClients = async (): Promise<ClientListItem[]> => {
    return GET<ClientListItem[]>('/api/trainers/my-clients');
};

export const getTrainerRoutines = async (): Promise<RoutineProfile[]> => {
    return GET<RoutineProfile[]>('/api/trainers/routines');
};