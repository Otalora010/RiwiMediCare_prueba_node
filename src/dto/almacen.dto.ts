/**
 * Almacen DTOs.
 * Input shapes for warehouse creation and update.
 */
import { AlmacenEstado } from '../models/Almacen';

export interface CreateAlmacenDto {
  name: string;
  location: string;
  estado?: AlmacenEstado;
}

export type UpdateAlmacenDto = Partial<CreateAlmacenDto>;
