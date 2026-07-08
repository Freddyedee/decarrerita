import { Client } from "../../domain/entitites/Client";

export interface IClientRepository {

    findByUserId(userId: number): Promise<Client | null>;

    update(client: Client): Promise<Client>;

}