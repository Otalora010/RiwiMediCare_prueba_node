import { MedicamentoEstado } from '../models/Medicamento';

export interface CreateMedicamentoDto {
  name: string;
  stock: number;
  almacenId: string;
  estado?: MedicamentoEstado;
}

export type UpdateMedicamentoDto = Partial<CreateMedicamentoDto>;
