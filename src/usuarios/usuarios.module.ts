import { Module } from '@nestjs/common';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity';
import { Perfil } from './perfil.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';
import { ConfigService } from '@nestjs/config'; // Importar ConfigService

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Perfil]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Usamos JWT_SECRET del archivo .env
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService], // Inyectamos ConfigService para acceder a las variables de entorno
    }),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, JwtStrategy, RolesGuard],
  exports: [UsuariosService],
})
export class UsuariosModule {}
