import { Op } from 'sequelize';
import { CreateClinicaDto, UpdateClinicaDto } from '../dto/clinica.dto';
import { Clinica, ClinicaEstado } from '../models/Clinica';

export class ClinicaRepository {
  create(data: CreateClinicaDto): Promise<Clinica> {
    return Clinica.create({
      name: data.name,
      nit: data.nit,
      responsable: data.responsable,
      estado: data.estado ?? ClinicaEstado.ACTIVA,
    });
  }

  findAll(): Promise<Clinica[]> {
    return Clinica.findAll({
      where: { estado: ClinicaEstado.ACTIVA },
      order: [['name', 'ASC']],
    });
  }

  findById(id: string): Promise<Clinica | null> {
    return Clinica.findByPk(id);
  }

  findByNit(nit: string): Promise<Clinica | null> {
    return Clinica.findOne({ where: { nit } });
  }

  async update(clinica: Clinica, data: UpdateClinicaDto): Promise<Clinica> {
    return clinica.update(data);
  }

  async softDelete(clinica: Clinica): Promise<Clinica> {
    return clinica.update({ estado: ClinicaEstado.ELIMINADA });
  }

  countActive(): Promise<number> {
    return Clinica.count({ where: { estado: ClinicaEstado.ACTIVA } });
  }

  findAllIncludingDeleted(): Promise<Clinica[]> {
    return Clinica.findAll({ order: [['createdAt', 'DESC']] });
  }
}

export const clinicaRepository = new ClinicaRepository();
