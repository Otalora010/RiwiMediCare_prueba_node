import { CreateAlmacenDto, UpdateAlmacenDto } from '../dto/almacen.dto';
import { Almacen, AlmacenEstado } from '../models/Almacen';

export class AlmacenRepository {
  create(data: CreateAlmacenDto): Promise<Almacen> {
    return Almacen.create({
      name: data.name,
      location: data.location,
      estado: data.estado ?? AlmacenEstado.ACTIVO,
    });
  }

  findAll(): Promise<Almacen[]> {
    return Almacen.findAll({
      where: { estado: AlmacenEstado.ACTIVO },
      order: [['name', 'ASC']],
    });
  }

  findById(id: string): Promise<Almacen | null> {
    return Almacen.findByPk(id);
  }

  async update(almacen: Almacen, data: UpdateAlmacenDto): Promise<Almacen> {
    return almacen.update(data);
  }

  async softDelete(almacen: Almacen): Promise<Almacen> {
    return almacen.update({ estado: AlmacenEstado.ELIMINADO });
  }
}

export const almacenRepository = new AlmacenRepository();
