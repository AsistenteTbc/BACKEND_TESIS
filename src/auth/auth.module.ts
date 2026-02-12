import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { User } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    // 1. Registramos la entidad User para poder usar el repositorio
    TypeOrmModule.forFeature([User]),
    // 2. Activamos Passport
    PassportModule,
    // 3. Configuración del Token
    JwtModule.register({
      secret: 'MI_CLAVE_SECRETA_123', // DEBE COINCIDIR con jwt.strategy.ts
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Exportamos por si otros módulos lo necesitan
})
export class AuthModule {}
