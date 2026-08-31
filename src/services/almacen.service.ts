import { AppError } from '../errors/AppError';
import { CreateAlmacenDto, UpdateAlmacenDto } from '../dto/almacen.dto';
import { AlmacenEstado } from '../models/Almacen';
import { almacenRepository } from '../repositories/almacen.repository';

export class AlmacenService {
  create(input: CreateAlmacenDto) {
    return almacenRepository.create(input);
  }

  list() {
    return almacenRepository.findAll();
  }

  async getById(id: string) {
    const almacen = await almacenRepository.findById(id);
    if (!almacen) throw new AppError(404, 'Almacén no encontrado', 'ALMACEN_NOT_FOUND');
    if (almacen.estado === AlmacenEstado.ELIMINADO) {
      throw new AppError(404, 'Almacén no encontrado', 'ALMACEN_NOT_FOUND');
    }
    return almacen;
  }

  async update(id: string, input: UpdateAlmacenDto) {
    const almacen = await this.getById(id);
    return almacenRepository.update(almacen, input);
  }

  async delete(id: string) {
    const almacen = await this.getById(id);
    await almacenRepository.softDelete(almacen);
  }
}

export const almacenService = new AlmacenService();
