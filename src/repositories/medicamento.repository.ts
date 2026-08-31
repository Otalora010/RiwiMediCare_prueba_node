import { CreateMedicamentoDto, UpdateMedicamentoDto } from '../dto/medicamento.dto';
import { Almacen } from '../models/Almacen';
import { Medicamento, MedicamentoEstado } from '../models/Medicamento';

export class MedicamentoRepository {
  create(data: CreateMedicamentoDto): Promise<Medicamento> {
    return Medicamento.create({
      name: data.name,
      stock: data.stock,
      almacenId: data.almacenId,
      estado: data.estado ?? MedicamentoEstado.ACTIVO,
    });
  }

  findAll(): Promise<Medicamento[]> {
    return Medicamento.findAll({
      where: { estado: MedicamentoEstado.ACTIVO },
      include: [{ model: Almacen, as: 'almacen', attributes: ['id', 'name', 'location'] }],
      order: [['name', 'ASC']],
    });
  }

  findById(id: string): Promise<Medicamento | null> {
    return Medicamento.findByPk(id, {
      include: [{ model: Almacen, as: 'almacen', attributes: ['id', 'name', 'location'] }],
    });
  }

  async update(medicamento: Medicamento, data: UpdateMedicamentoDto): Promise<Medicamento> {
    await medicamento.update(data);
    return this.findById(medicamento.id) as Promise<Medicamento>;
  }

  async softDelete(medicamento: Medicamento): Promise<Medicamento> {
    return medicamento.update({ estado: MedicamentoEstado.ELIMINADO });
  }
}

export const medicamentoRepository = new MedicamentoRepository();
