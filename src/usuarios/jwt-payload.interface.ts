// src/auth/jwt-payload.interface.ts

export interface JwtPayload {
  email: string; // Email de usuario
  sub: number; // ID del usuario (sub es un campo estándar en el JWT, que se utiliza para el identificador del usuario)
  roles: string[]; // Roles del usuario, se almacena como un arreglo de strings
}
