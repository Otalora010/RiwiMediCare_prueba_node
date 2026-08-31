import { AlmacenEstado } from '../models/Almacen';

export interface CreateAlmacenDto {
  name: string;
  location: string;
  estado?: AlmacenEstado;
}

export type UpdateAlmacenDto = Partial<CreateAlmacenDto>;
