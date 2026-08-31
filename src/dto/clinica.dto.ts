/**
 * Clinica DTOs.
 * Input shapes for clinic creation and update.
 */
import { ClinicaEstado } from '../models/Clinica';

export interface CreateClinicaDto {
  name: string;
  nit: string;
  responsable: string;
  estado?: ClinicaEstado;
}

export type UpdateClinicaDto = Partial<CreateClinicaDto>;
