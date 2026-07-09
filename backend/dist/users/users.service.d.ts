import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    createUser(phone: string, password: string, firstName?: string, lastName?: string): Promise<User>;
    save(user: User): Promise<User>;
}
