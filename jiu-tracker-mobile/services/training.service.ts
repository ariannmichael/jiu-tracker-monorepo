import { CreateTrainingRequest, TrainingSession } from "@jiu-tracker/shared";
import Api from "./api";

export default class TrainingService {
    static async createTraining(data: CreateTrainingRequest, token: string): Promise<TrainingSession> {
        const response = await fetch(`${Api.BASE_URL}/training`, {
            method: 'POST',
            headers: Api.authHeaders(token),
            body: JSON.stringify(data),
        });
        return response.json();
    }
}