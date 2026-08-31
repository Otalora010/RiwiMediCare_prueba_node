import { Op } from 'sequelize';
import { CreateSolicitudDto } from '../dto/solicitud.dto';
import { Almacen } from '../models/Almacen';
import { Clinica } from '../models/Clinica';
import { Medicamento } from '../models/Medicamento';
import { Solicitud, SolicitudEstado } from '../models/Solicitud';
import { User } from '../models/User';

export class SolicitudRepository {
  create(data: CreateSolicitudDto & { userId: string }): Promise<Solicitud> {
    return Solicitud.create({
      clinicaId: data.clinicaId,
      medicamentoId: data.medicamentoId,
      almacenId: data.almacenId,
      cantidadSolicitada: data.cantidadSolicitada,
      estado: data.estado ?? SolicitudEstado.PENDIENTE,
      userId: data.userId,
    });
  }

  findById(id: string): Promise<Solicitud | null> {
    return Solicitud.findByPk(id, {
      include: [
        { model: Clinica, as: 'clinica', attributes: ['id', 'name', 'nit', 'responsable'] },
        { model: Medicamento, as: 'medicamento', attributes: ['id', 'name', 'stock', 'almacenId'] },
        { model: Almacen, as: 'almacen', attributes: ['id', 'name', 'location'] },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });
  }

  findActivas(): Promise<Solicitud[]> {
    return Solicitud.findAll({
      where: {
        estado: { [Op.in]: [SolicitudEstado.PENDIENTE, SolicitudEstado.APROBADA] },
      },
      include: [
        { model: Clinica, as: 'clinica' },
        { model: Medicamento, as: 'medicamento' },
        { model: Almacen, as: 'almacen' },
        { model: User, as: 'user', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  findHistorial(): Promise<Solicitud[]> {
    return Solicitud.findAll({
      where: { estado: { [Op.ne]: SolicitudEstado.ELIMINADA } },
      include: [
        { model: Clinica, as: 'clinica' },
        { model: Medicamento, as: 'medicamento' },
        { model: Almacen, as: 'almacen' },
        { model: User, as: 'user', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  findByClinica(clinicaId: string): Promise<Solicitud[]> {
    return Solicitud.findAll({
      where: { clinicaId, estado: { [Op.ne]: SolicitudEstado.ELIMINADA } },
      include: [
        { model: Clinica, as: 'clinica' },
        { model: Medicamento, as: 'medicamento' },
        { model: Almacen, as: 'almacen' },
        { model: User, as: 'user', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async updateEstado(solicitud: Solicitud, estado: SolicitudEstado): Promise<Solicitud> {
    await solicitud.update({ estado });
    return this.findById(solicitud.id) as Promise<Solicitud>;
  }

  async softDelete(solicitud: Solicitud): Promise<Solicitud> {
    return solicitud.update({ estado: SolicitudEstado.ELIMINADA });
  }
}

export const solicitudRepository = new SolicitudRepository();
