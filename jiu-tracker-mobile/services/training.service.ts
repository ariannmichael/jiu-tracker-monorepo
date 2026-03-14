import { CreateTrainingRequest, TrainingSession, TrainingSessionsResponse } from "@jiu-tracker/shared";
import Api from "./api";

/** Payload for PUT /api/training/:id (matches backend UpdateTrainingDto) */
export interface UpdateTrainingRequest {
    date: string;
    is_open_mat: boolean;
    is_gi?: boolean;
    submit_using_options_ids: string[];
    tapped_by_options_ids: string[];
    duration: number;
    notes?: string;
}

export default class TrainingService {
    static async createTraining(data: CreateTrainingRequest, token: string): Promise<TrainingSession> {
        const response = await Api.request('/training', {
            method: 'POST',
            headers: Api.authHeaders(token),
            body: JSON.stringify(data),
        }, {
            operation: 'training.create',
        });
        const body = await response.json();
        if (!response.ok) {
            const message = body?.message ?? body?.error ?? 'Request failed';
            throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }
        return body.training;
    }

    static async updateTraining(
        id: string,
        data: UpdateTrainingRequest,
        token: string,
    ): Promise<TrainingSession> {
        const response = await Api.request(`/training/${id}`, {
            method: 'PUT',
            headers: Api.authHeaders(token),
            body: JSON.stringify(data),
        }, {
            operation: 'training.update',
        });
        const body = await response.json();
        if (!response.ok) {
            const message = body?.message ?? body?.error ?? 'Request failed';
            throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }
        return body.training;
    }

    static async getTrainings(
        token: string,
        limit: number,
        offset: number,
        userId: string,
    ): Promise<{ trainings: TrainingSession[]; total: number }> {
        const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
        const response = await Api.request(`/trainings/user/${userId}?${params}`, {
            method: 'GET',
            headers: Api.authHeaders(token),
        }, {
            operation: 'training.listByUser',
        });
        const data: TrainingSessionsResponse & { total?: number } = await response.json();
        return {
            trainings: data.trainings ?? [],
            total: data.total ?? 0,
        };
    }
}
