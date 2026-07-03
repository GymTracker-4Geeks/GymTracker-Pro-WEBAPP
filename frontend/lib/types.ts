//////////////////////////////
//       Auth Service       //
//////////////////////////////
export interface RegisterData {
    full_name: string;
    email: string;
    password?: string;
    confirm_password: string;
}

export interface RegisterFormState extends RegisterData {
    confirm_password: string;
}

export interface LoginData {
    email: string;
    password?: string;
}

export interface ChangePasswordData {
    oldPassword?: string;
    newPassword?: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    token?: string;
    newPassword?: string;
}

export interface User {
    id: number;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
}

export interface AuthResponse {
    user: User;
    access_token: string;
}

export interface MessageResponse {
    message: string;
    status?: string;
}
////////////////////////////////
//        Client Service      //
////////////////////////////////
export interface ClientProfile {
    id: number;
    user_id: number;
    trainer_id: number | null;
    height: number | null;
    routine_ids: number[];
}

export interface TrainerProfile {
    id: number;
    user_id: number;
    specialty: string | null;
}

export interface BodyWeightRecord {
    id: number;
    client_id: number;
    weight: number;
    recorded_at: string;
}

export interface ClientProfileExtended extends ClientProfile {
    full_name: string;
    email: string;
}

export interface TrainerProfileExtended extends TrainerProfile {
    full_name: string;
    email: string;
}

export interface GetTrainerResponse {
    trainer: TrainerProfileExtended | null;
}

export interface GetWeightResponse {
    weight: BodyWeightRecord;
}

export interface GetWeightsHistoryResponse {
    weights: BodyWeightRecord[];
}

export interface GetHeightResponse {
    height: number | null;
}

export interface UpdateHeightResponse {
    message: string;
    height: number;
}

export interface AddWeightResponse {
    message: string;
    weight: BodyWeightRecord;
}
//////////////////////////////////
//       Routine Service        //
//////////////////////////////////
export interface RoutineExercise {
    id: number;
    name: string;
    reps: number;
    sets: number;
    muscle_group: string;
}

export interface RoutineProfile {
    id: number;
    name: string;
    description: string;
    trainer_id: number;
    exercises: RoutineExercise[]
}

export interface ClientRoutinesResponse extends ClientProfile {
    routines: RoutineProfile[] | null;
}

export interface AssignRoutineData {
    routine_id: number;
    client_id: number;
}

export interface CreateRoutineResponse {
    message: string;
    routine: RoutineProfile;
}