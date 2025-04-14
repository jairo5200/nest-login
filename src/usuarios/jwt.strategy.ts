import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as JwtPassportStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express'; // Necesario para acceder a la solicitud

@Injectable()
export class JwtStrategy extends PassportStrategy(JwtPassportStrategy) {
  constructor(private configService: ConfigService) {
    // Obtenemos la clave secreta de JWT desde las variables de entorno
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    // Configuración de la estrategia JWT
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // Para el header
        (req: Request) => req.cookies['jwt'], // Para las cookies
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // Usamos la variable de entorno para la clave secreta
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.username,
      roles: payload.roles,
    };
  }
}
