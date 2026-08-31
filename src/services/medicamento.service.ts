import { AppError } from '../errors/AppError';
import { CreateMedicamentoDto, UpdateMedicamentoDto } from '../dto/medicamento.dto';
import { MedicamentoEstado } from '../models/Medicamento';
import { almacenRepository } from '../repositories/almacen.repository';
import { medicamentoRepository } from '../repositories/medicamento.repository';

export class MedicamentoService {
  async create(input: CreateMedicamentoDto) {
    const almacen = await almacenRepository.findById(input.almacenId);
    if (!almacen) throw new AppError(404, 'Almacén no encontrado', 'ALMACEN_NOT_FOUND');
    if ((almacen as unknown as { estado: string }).estado === 'ELIMINADO') {
      throw new AppError(404, 'Almacén no encontrado', 'ALMACEN_NOT_FOUND');
    }
    if (!Number.isFinite(input.stock) || input.stock < 0) {
      throw new AppError(400, 'El stock debe ser un número mayor o igual a cero', 'VALIDATION_ERROR');
    }
    return medicamentoRepository.create(input);
  }

  list() {
    return medicamentoRepository.findAll();
  }

  async getById(id: string) {
    const medicamento = await medicamentoRepository.findById(id);
    if (!medicamento) throw new AppError(404, 'Medicamento no encontrado', 'MEDICAMENTO_NOT_FOUND');
    if (medicamento.estado === MedicamentoEstado.ELIMINADO) {
      throw new AppError(404, 'Medicamento no encontrado', 'MEDICAMENTO_NOT_FOUND');
    }
    return medicamento;
  }

  async update(id: string, input: UpdateMedicamentoDto) {
    const medicamento = await this.getById(id);
    if (input.almacenId && input.almacenId !== medicamento.almacenId) {
      const almacen = await almacenRepository.findById(input.almacenId);
      if (!almacen) throw new AppError(404, 'Almacén no encontrado', 'ALMACEN_NOT_FOUND');
    }
    if (input.stock !== undefined && (!Number.isFinite(input.stock) || input.stock < 0)) {
      throw new AppError(400, 'El stock debe ser un número mayor o igual a cero', 'VALIDATION_ERROR');
    }
    return medicamentoRepository.update(medicamento, input);
  }

  async delete(id: string) {
    const medicamento = await this.getById(id);
    await medicamentoRepository.softDelete(medicamento);
  }
}

export const medicamentoService = new MedicamentoService();
