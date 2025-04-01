import { Perfil } from '../perfil.entity';

export class validarUsuarioDto {
  id: number;
  email: string;
  createdAt: Date;
  roles: string;
  perfil: Perfil;
}
