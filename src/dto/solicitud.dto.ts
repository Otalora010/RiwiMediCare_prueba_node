import { SolicitudEstado } from '../models/Solicitud';

export interface CreateSolicitudDto {
  clinicaId: string;
  medicamentoId: string;
  almacenId: string;
  cantidadSolicitada: number;
  estado?: SolicitudEstado;
}

export interface UpdateSolicitudEstadoDto {
  estado: SolicitudEstado;
}

export interface SolicitudQueryDto {
  clinicaId?: string;
  estado?: SolicitudEstado;
}
