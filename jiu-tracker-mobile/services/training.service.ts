import { CreateTrainingRequest, TrainingSession, TrainingSessionsResponse } from "@jiu-tracker/shared";
import Api from "./api";

export default class TrainingService {
    static async createTraining(data: CreateTrainingRequest, token: string): Promise<TrainingSession> {
        const response = await fetch(`${Api.BASE_URL}/training`, {
            method: 'POST',
            headers: Api.authHeaders(token),
            body: JSON.stringify(data),
        });
        const body = await response.json();
        if (!response.ok) {
            const message = body?.message ?? body?.error ?? 'Request failed';
            throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }
        return body.training;
    }

    static async getTrainings(token: string): Promise<TrainingSession[]> {
        const response = await fetch(`${Api.BASE_URL}/trainings`, {
            method: 'GET',
            headers: Api.authHeaders(token),
        });
        const data: TrainingSessionsResponse = await response.json();
        return data.trainings ?? [];
    }
}