import { CreateAlmacenDto, UpdateAlmacenDto } from '../dto/almacen.dto';
import { Almacen, AlmacenEstado } from '../models/Almacen';
// Repository responsible for handling database operations related to warehouses.
export class AlmacenRepository {
  // Creates a new warehouse with the provided data.
  create(data: CreateAlmacenDto): Promise<Almacen> {
    return Almacen.create({
      name: data.name,
      location: data.location,
      estado: data.estado ?? AlmacenEstado.ACTIVO,
    });
  }
  // Retrieves all active warehouses ordered alphabetically by name.
  findAll(): Promise<Almacen[]> {
    return Almacen.findAll({
      where: { estado: AlmacenEstado.ACTIVO },
      order: [['name', 'ASC']],
    });
  }
  // Finds a warehouse by its primary key.
  findById(id: string): Promise<Almacen | null> {
    return Almacen.findByPk(id);
  }
  // Updates an existing warehouse with the provided data.
  async update(almacen: Almacen, data: UpdateAlmacenDto): Promise<Almacen> {
    return almacen.update(data);
  }
  // Performs a soft delete by changing the warehouse status to deleted.
  async softDelete(almacen: Almacen): Promise<Almacen> {
    return almacen.update({ estado: AlmacenEstado.ELIMINADO });
  }
}
// Creates and exports a single repository instance.
export const almacenRepository = new AlmacenRepository();