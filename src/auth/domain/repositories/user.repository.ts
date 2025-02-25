import { CreateUserDto } from '../../application/dto/create-user.dto';
import { User } from '../entities/user.entity';

export abstract class AuthRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(createUserDto:CreateUserDto): Promise<User>;
  abstract findById(id: number): Promise<User | null>;
  abstract findByNickOrEmail(nick: string, email: string): Promise<User | null>;
}
