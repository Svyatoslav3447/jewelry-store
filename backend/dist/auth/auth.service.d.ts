import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(phone: string, password: string, firstName?: string, lastName?: string): Promise<import("../users/user.entity").User>;
    login(phone: string, password: string): Promise<{
        access_token: string;
    }>;
}
