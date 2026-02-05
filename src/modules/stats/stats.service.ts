import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsultationLog } from '../../entities/consultationLog';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(ConsultationLog)
    private logRepo: Repository<ConsultationLog>,
  ) {}

  async logConsultation(data: Partial<ConsultationLog>) {
    const log = this.logRepo.create(data);
    return await this.logRepo.save(log);
  }

  // AHORA ACEPTAMOS 3 FILTROS: Provincia, Desde, Hasta
  async getDashboardStats(provinceFilter?: string, from?: string, to?: string) {
    // Función auxiliar para aplicar TODOS los filtros
    const applyFilter = (query: any) => {
      // 1. Filtro de Provincia
      if (provinceFilter && provinceFilter !== 'TODAS') {
        query.andWhere('log.provinceName = :province', {
          province: provinceFilter,
        });
      }

      // 2. Filtro de Fecha DESDE (Inicio del día)
      if (from) {
        query.andWhere('log.createdAt >= :from', { from: `${from} 00:00:00` });
      }

      // 3. Filtro de Fecha HASTA (Fin del día)
      if (to) {
        query.andWhere('log.createdAt <= :to', { to: `${to} 23:59:59` });
      }

      return query;
    };

    // A. Casos por Provincia
    let qProvince = this.logRepo
      .createQueryBuilder('log')
      .select('log.provinceName', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy('log.provinceName');

    qProvince = applyFilter(qProvince);

    const byProvinceRaw = await qProvince.getRawMany();
    const byProvince = byProvinceRaw.map((item) => ({
      name: item.name,
      value: Number(item.value),
    }));

    // B. Casos por Gravedad
    let qSeverity = this.logRepo
      .createQueryBuilder('log')
      .select('log.resultVariant', 'variant')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.resultVariant');

    qSeverity = applyFilter(qSeverity);

    const bySeverityRaw = await qSeverity.getRawMany();
    const bySeverity = bySeverityRaw.map((s) => ({
      name:
        s.variant === 3
          ? 'Priorizado (GeneXpert)'
          : s.variant === 2
            ? 'Estándar'
            : s.variant === 4
              ? 'Urgente Extra'
              : 'Info',
      value: Number(s.count),
    }));

    // C. Casos por Ciudad
    let qCity = this.logRepo
      .createQueryBuilder('log')
      .select('log.provinceName', 'province')
      .addSelect('log.cityName', 'city')
      .addSelect('COUNT(*)', 'value')
      .groupBy('log.provinceName')
      .addGroupBy('log.cityName')
      .orderBy('value', 'DESC');

    qCity = applyFilter(qCity);

    const byCityRaw = await qCity.getRawMany();
    const byCity = byCityRaw.map((item) => ({
      province: item.province,
      city: item.city,
      value: Number(item.value),
    }));

    // 👇 D. EVOLUCIÓN TEMPORAL (NUEVO) 👇
    // Agrupa los casos por día para el gráfico de líneas
    let qTrend = this.logRepo
      .createQueryBuilder('log')
      // Postgres usa TO_CHAR para formatear fechas
      .select("TO_CHAR(log.created_at, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(*)', 'value')
      .groupBy("TO_CHAR(log.created_at, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC'); // Importante: Ordenar por fecha ascendente

    qTrend = applyFilter(qTrend); // Aplicamos los mismos filtros (fechas y provincia)

    const byTrendRaw = await qTrend.getRawMany();
    const byTrend = byTrendRaw.map((item) => ({
      date: item.date, // Retorna string '2023-10-25'
      value: Number(item.value),
    }));

    return {
      byProvince,
      bySeverity,
      byCity,
      byTrend, // <--- Agregamos esto al retorno
    };
  }
}
