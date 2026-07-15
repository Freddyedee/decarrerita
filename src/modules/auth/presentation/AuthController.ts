import { LoginRequest } from "../application/dto/LoginRequest";
import { SessionResponse } from "../application/dto/SessionResponse";
import { LoginUseCase } from "../application/usecases/LoginUseCase";
import { LogoutUseCase } from "../application/usecases/LogoutUseCase";

export class AuthController {

    constructor(

        private readonly loginUseCase: LoginUseCase,

        private readonly logoutUseCase: LogoutUseCase

    ) {}

    async login(
        request: LoginRequest
    ): Promise<SessionResponse> {

        return await this.loginUseCase.execute(request);

    }

    async logout(): Promise<void> {

        await this.logoutUseCase.execute();

    }

}