/**
 * Solicitud service.
 * Business logic for supply requests, stock checks and state transitions.
 */
import { AppError } from '../errors/AppError';
import { CreateSolicitudDto } from '../dto/solicitud.dto';
import { ClinicaEstado } from '../models/Clinica';
import { AlmacenEstado } from '../models/Almacen';
import { MedicamentoEstado } from '../models/Medicamento';
import { SolicitudEstado } from '../models/Solicitud';
import { clinicaRepository } from '../repositories/clinica.repository';
import { almacenRepository } from '../repositories/almacen.repository';
import { medicamentoRepository } from '../repositories/medicamento.repository';
import { solicitudRepository } from '../repositories/solicitud.repository';

const estadosValidosUpdate = [
  SolicitudEstado.PENDIENTE,
  SolicitudEstado.APROBADA,
  SolicitudEstado.RECHAZADA,
  SolicitudEstado.DESPACHADA,
  SolicitudEstado.CANCELADA,
] as const;

export class SolicitudService {
  async create(input: CreateSolicitudDto, userId: string) {
    if (!Number.isFinite(input.cantidadSolicitada) || input.cantidadSolicitada <= 0) {
      throw new AppError(400, 'Requested quantity must be greater than zero', 'VALIDATION_ERROR');
    }

    const clinica = await clinicaRepository.findById(input.clinicaId);
    if (!clinica || clinica.estado === ClinicaEstado.ELIMINADA) {
      throw new AppError(404, 'Clinic not found', 'CLINICA_NOT_FOUND');
    }

    const medicamento = await medicamentoRepository.findById(input.medicamentoId);
    if (!medicamento || medicamento.estado === MedicamentoEstado.ELIMINADO) {
      throw new AppError(404, 'Medication not found', 'MEDICAMENTO_NOT_FOUND');
    }

    const almacen = await almacenRepository.findById(input.almacenId);
    if (!almacen || (almacen as unknown as { estado: string }).estado === AlmacenEstado.ELIMINADO) {
      throw new AppError(404, 'Warehouse not found', 'ALMACEN_NOT_FOUND');
    }

    if (String(medicamento.almacenId) !== String(input.almacenId)) {
      throw new AppError(400, 'Medication does not belong to the specified warehouse', 'VALIDATION_ERROR');
    }

    if (medicamento.stock < input.cantidadSolicitada) {
      throw new AppError(400, 'Stock insuficiente del medicamento', 'INSUFFICIENT_STOCK');
    }

    if (input.estado && input.estado !== SolicitudEstado.PENDIENTE) {
      throw new AppError(400, 'Initial status must be PENDING', 'VALIDATION_ERROR');
    }

    return solicitudRepository.create({ ...input, userId, estado: SolicitudEstado.PENDIENTE });
  }

  async getById(id: string) {
    const solicitud = await solicitudRepository.findById(id);
    if (!solicitud) throw new AppError(404, 'Request not found', 'SOLICITUD_NOT_FOUND');
    if (solicitud.estado === SolicitudEstado.ELIMINADA) {
      throw new AppError(404, 'Request not found', 'SOLICITUD_NOT_FOUND');
    }
    return solicitud;
  }

  listActivas() {
    return solicitudRepository.findActivas();
  }

  listHistorial() {
    return solicitudRepository.findHistorial();
  }

  async listByClinica(clinicaId: string) {
    const clinica = await clinicaRepository.findById(clinicaId);
    if (!clinica || clinica.estado === ClinicaEstado.ELIMINADA) {
      throw new AppError(404, 'Clinic not found', 'CLINICA_NOT_FOUND');
    }
    return solicitudRepository.findByClinica(clinicaId);
  }

  async updateEstado(id: string, nuevoEstado: SolicitudEstado) {
    if (!Object.values(estadosValidosUpdate).includes(nuevoEstado as unknown as typeof estadosValidosUpdate[number])) {
      throw new AppError(400, `Status must be one of: ${estadosValidosUpdate.join(', ')}`, 'VALIDATION_ERROR');
    }
    const solicitud = await this.getById(id);
    return solicitudRepository.updateEstado(solicitud, nuevoEstado);
  }

  async delete(id: string) {
    const solicitud = await this.getById(id);
    await solicitudRepository.softDelete(solicitud);
  }
}

export const solicitudService = new SolicitudService();
