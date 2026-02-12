import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // REGISTRO
  async register(registerDto: any) {
    const { email, password, fullName } = registerDto;

    // Verificar si existe
    const exists = await this.userRepository.findOneBy({ email });
    if (exists) throw new ConflictException('El email ya existe');

    // Hashear contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar
    const user = this.userRepository.create({
      email,
      fullName,
      password: hashedPassword,
    });

    await this.userRepository.save(user);
    return { message: 'Usuario registrado correctamente' };
  }

  // LOGIN
  async login(loginDto: any) {
    const { email, password } = loginDto;

    // Buscar usuario
    const user = await this.userRepository.findOneBy({ email });

    // Validar contraseña
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generar Token
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      };
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }
}
