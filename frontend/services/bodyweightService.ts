import { GET, POST, PATCH, DELETE } from "./api"
import type {
    BodyWeightRecord,
    CreateWeightResponse,
    UpdateWeightResponse,
    MessageResponse,
} from "@/lib/types"

export const getWeights = async (signal?: AbortSignal): Promise<BodyWeightRecord[]> =>
    GET<BodyWeightRecord[]>("/api/bodyweight", signal)

export const createWeight = async (data: {
    weight: number
}): Promise<CreateWeightResponse> =>
    POST<CreateWeightResponse, typeof data>("/api/bodyweight", data)

export const updateWeight = async (
    id: number,
    data: { weight?: number }
): Promise<UpdateWeightResponse> =>
    PATCH<UpdateWeightResponse, typeof data>(`/api/bodyweight/${id}`, data)

export const deleteWeight = async (id: number): Promise<MessageResponse> =>
    DELETE<MessageResponse>(`/api/bodyweight/${id}`)
