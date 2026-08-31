import { CreateMedicamentoDto, UpdateMedicamentoDto } from '../dto/medicamento.dto';
import { Almacen } from '../models/Almacen';
import { Medicamento, MedicamentoEstado } from '../models/Medicamento';
// Repository responsible for handling database operations related to medicines.
export class MedicamentoRepository {
  // Creates a new medicine with the provided data.
  create(data: CreateMedicamentoDto): Promise<Medicamento> {
    return Medicamento.create({
      name: data.name,
      stock: data.stock,
      almacenId: data.almacenId,
      estado: data.estado ?? MedicamentoEstado.ACTIVO,
    });
  }
  // Retrieves all active medicines, including their associated warehouse information.
  findAll(): Promise<Medicamento[]> {
    return Medicamento.findAll({
      where: { estado: MedicamentoEstado.ACTIVO },
      include: [{ model: Almacen, as: 'almacen', attributes: ['id', 'name', 'location'] }],
      order: [['name', 'ASC']],
    });
  }
  // Finds a medicine by its primary key, including its associated warehouse.
  findById(id: string): Promise<Medicamento | null> {
    return Medicamento.findByPk(id, {
      include: [{ model: Almacen, as: 'almacen', attributes: ['id', 'name', 'location'] }],
    });
  }
  // Updates an existing medicine and then retrieves the updated record.
  async update(medicamento: Medicamento, data: UpdateMedicamentoDto): Promise<Medicamento> {
    await medicamento.update(data);
    return this.findById(medicamento.id) as Promise<Medicamento>;
  }
  // Performs a soft delete by changing the medicine status to deleted.
  async softDelete(medicamento: Medicamento): Promise<Medicamento> {
    return medicamento.update({ estado: MedicamentoEstado.ELIMINADO });
  }
}
// Creates and exports a single repository instance.
export const medicamentoRepository = new MedicamentoRepository();