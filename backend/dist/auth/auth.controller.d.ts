import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: {
        phone: string;
        password: string;
        firstName?: string;
        lastName?: string;
    }): Promise<import("../users/user.entity").User>;
    login(body: {
        phone: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
