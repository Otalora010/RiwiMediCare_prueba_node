import { AppError } from '../errors/AppError';
import { Clinica } from '../models/Clinica';
import { Almacen } from '../models/Almacen';
import { Medicamento } from '../models/Medicamento';
import { User, Role } from '../models/User';
import { hashPassword } from '../utils/password';
import { sequelize } from '../config/database';

interface SeedPayload {
  usuarios?: Array<{ name: string; email: string; password: string; role?: string }>;
  clinicas?: Array<{ name: string; nit: string; responsable: string }>;
  almacenes?: Array<{ name: string; location: string; medicamentos?: Array<{ name: string; stock: number }> }>;
  medicamentos?: Array<{ name: string; stock: number; almacenId?: string; almacenName?: string }>;
}

export class SeedService {
  async bulkInsert(json: SeedPayload) {
    const summary = { usuarios: 0, clinicas: 0, almacenes: 0, medicamentos: 0 };
    const transaction = await sequelize.transaction();
    try {
      if (json.usuarios && Array.isArray(json.usuarios)) {
        for (const u of json.usuarios) {
          if (!u.email || !u.password || !u.name) continue;
          const existing = await User.findOne({ where: { email: u.email.toLowerCase() }, transaction });
          if (existing) continue;
          const role = u.role && Object.values(Role).includes(u.role as Role) ? (u.role as Role) : Role.GESTOR;
          await User.create(
            {
              name: u.name,
              email: u.email.toLowerCase(),
              password: await hashPassword(u.password),
              role,
              isActive: true,
            },
            { transaction },
          );
          summary.usuarios++;
        }
      }

      if (json.clinicas && Array.isArray(json.clinicas)) {
        for (const c of json.clinicas) {
          if (!c.nit || !c.name || !c.responsable) continue;
          const existing = await Clinica.findOne({ where: { nit: c.nit }, transaction });
          if (existing) continue;
          await Clinica.create({ name: c.name, nit: c.nit, responsable: c.responsable }, { transaction });
          summary.clinicas++;
        }
      }

      const almacenMap = new Map<string, Almacen>();

      if (json.almacenes && Array.isArray(json.almacenes)) {
        for (const a of json.almacenes) {
          if (!a.name || !a.location) continue;
          let almacen = await Almacen.findOne({ where: { name: a.name }, transaction });
          if (!almacen) {
            almacen = await Almacen.create({ name: a.name, location: a.location }, { transaction });
            summary.almacenes++;
          }
          almacenMap.set(a.name, almacen);
          if (a.medicamentos && Array.isArray(a.medicamentos)) {
            for (const m of a.medicamentos) {
              if (!m.name || m.stock === undefined) continue;
              const existing = await Medicamento.findOne({
                where: { name: m.name, almacenId: almacen.id },
                transaction,
              });
              if (existing) continue;
              await Medicamento.create({ name: m.name, stock: Number(m.stock), almacenId: almacen.id }, { transaction });
              summary.medicamentos++;
            }
          }
        }
      }

      if (json.medicamentos && Array.isArray(json.medicamentos)) {
        for (const m of json.medicamentos) {
          if (!m.name || m.stock === undefined) continue;
          let almacenId = m.almacenId;
          if (!almacenId && m.almacenName) {
            const alm = almacenMap.get(m.almacenName) || (await Almacen.findOne({ where: { name: m.almacenName }, transaction }));
            if (alm) almacenId = alm.id;
          }
          if (!almacenId) continue;
          const existing = await Medicamento.findOne({ where: { name: m.name, almacenId }, transaction });
          if (existing) continue;
          await Medicamento.create({ name: m.name, stock: Number(m.stock), almacenId }, { transaction });
          summary.medicamentos++;
        }
      }

      await transaction.commit();
      return summary;
    } catch (error) {
      await transaction.rollback();
      if (error instanceof AppError) throw error;
      throw new AppError(400, 'Error procesando el archivo seed: ' + String((error as Error).message), 'SEED_ERROR');
    }
  }

  parseFile(buffer: Buffer): SeedPayload {
    try {
      const text = buffer.toString('utf-8');
      const json = JSON.parse(text) as SeedPayload;
      if (typeof json !== 'object' || json === null) {
        throw new AppError(400, 'El JSON debe ser un objeto con claves usuarios, clinicas, almacenes, medicamentos', 'VALIDATION_ERROR');
      }
      return json;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(400, 'El archivo no es un JSON válido', 'VALIDATION_ERROR');
    }
  }
}

export const seedService = new SeedService();
