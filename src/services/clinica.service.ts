/**
 * Clinica service.
 * Handles business rules: NIT uniqueness and soft delete.
 */
import { AppError } from '../errors/AppError';
import { CreateClinicaDto, UpdateClinicaDto } from '../dto/clinica.dto';
import { ClinicaEstado } from '../models/Clinica';
import { clinicaRepository } from '../repositories/clinica.repository';

export class ClinicaService {
  async create(input: CreateClinicaDto) {
    const existing = await clinicaRepository.findByNit(input.nit);
    if (existing) throw new AppError(409, 'Ya existe una clínica con ese NIT', 'NIT_IN_USE');
    return clinicaRepository.create(input);
  }

  list() {
    return clinicaRepository.findAll();
  }

  async getById(id: string) {
    const clinica = await clinicaRepository.findById(id);
    if (!clinica) throw new AppError(404, 'Clínica no encontrada', 'CLINICA_NOT_FOUND');
    if (clinica.estado === ClinicaEstado.ELIMINADA) {
      throw new AppError(404, 'Clínica no encontrada', 'CLINICA_NOT_FOUND');
    }
    return clinica;
  }

  async update(id: string, input: UpdateClinicaDto) {
    const clinica = await this.getById(id);
    if (input.nit && input.nit !== clinica.nit) {
      const existing = await clinicaRepository.findByNit(input.nit);
      if (existing) throw new AppError(409, 'Ya existe una clínica con ese NIT', 'NIT_IN_USE');
    }
    return clinicaRepository.update(clinica, input);
  }

  async delete(id: string) {
    const clinica = await this.getById(id);
    await clinicaRepository.softDelete(clinica);
  }
}

export const clinicaService = new ClinicaService();
