//////////////////////////////
//       Auth Service       //
//////////////////////////////
export interface LoginData {
    email: string;
    password?: string;
}

export interface RegisterData {
    full_name: string;
    email: string;
    password?: string;
    confirm_password: string;
}

export interface RegisterFormState extends RegisterData {
    confirm_password: string;
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

export interface AuthResponse {
    user: UserProfile;
    access_token: string;
}

export interface MessageResponse {
    message: string;
    status?: string;
}
//////////////////////////////
//       User Service       //
//////////////////////////////
export interface UserProfile {
    id: number;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
}

export interface UsersResponse {
    users: UserProfile[];
    has_more: boolean;
}

export interface AdminProfile extends UserProfile {
    user_id: string;
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

export interface TodaySummary {
    completed_exercises: number;
    total_exercises: number;
    volume: number;
    estimated_minutes: number;
    estimated_calories: number;
}

export interface DashboardInfo {
    client: ClientProfileExtended;
    trainer: TrainerProfileExtended | null;
    last_weight: BodyWeightRecord | null;
    height: number | null;
    today_routine: RoutineProfile | null;
    today_summary: TodaySummary | null;
}

export interface TrainerProfile {
    id: number;
    user_id: number;
    specialty: string | null;
}

export interface UnassignedClient {
    id: number;
    full_name: string;
    email: string | null;
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

export interface UpdateRoleResponse {
    message: string;
    user: UserProfile;
}

export interface AddWeightResponse {
    message: string;
    weight: BodyWeightRecord;
}

export interface ClientListItem {
    id: number;
    full_name: string;
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
//////////////////////////////////
//       Exercise Service       //
//////////////////////////////////
export interface ExerciseProfile {
    id: number;
    name: string;
    sets: number;
    reps: number;
    muscle_group: string;
    routine_id: number;
    fav: boolean;
}
