import { Perfil } from '../perfil.entity';

export class validarUsuarioDto {
  id: number;
  username: string;
  createdAt: Date;
  authStrategy: string;
  roles: string;
  perfil: Perfil;
}
