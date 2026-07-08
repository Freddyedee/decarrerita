import { User } from "../../domain/entitites/User";
import { Email } from "../../domain/value-objects/Email";

export interface IUserRepository {
    findById(id: number): Promise<User | null>;

    findByEmail(email: Email): Promise<User | null>;

    save(user: User): Promise<User>;

    update(user: User): Promise<User>;

}