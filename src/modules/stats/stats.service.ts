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

  // AHORA ACEPTAMOS 3 FILTROS: Provincia (como ID string o 'TODAS'), Desde, Hasta
  async getDashboardStats(provinceFilter?: string, from?: string, to?: string) {
    if (from && to && from > to) {
      throw new Error(
        'La fecha "desde" no puede ser posterior a la fecha "hasta"',
      );
    }

    // --- FUNCIÓN AUXILIAR PARA APLICAR FILTROS ---
    const applyFilter = (query: any) => {
      // 1. Filtro de Provincia (Ahora por ID)
      if (provinceFilter && provinceFilter !== 'TODAS') {
        // Aseguramos que sea número para la consulta SQL
        query.andWhere('log.provinceId = :provinceId', {
          provinceId: Number(provinceFilter),
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

    // --- A. Casos por Provincia (Usando JOIN) ---
    let qProvince = this.logRepo
      .createQueryBuilder('log')
      .leftJoin('province', 'p', 'p.id = log.province_id') // JOIN con tabla provincia
      .select('p.name', 'name') // Seleccionamos el nombre real actualizado
      .addSelect('COUNT(log.id)', 'value')
      .groupBy('p.name');

    qProvince = applyFilter(qProvince);

    const byProvinceRaw = await qProvince.getRawMany();
    const byProvince = byProvinceRaw.map((item) => ({
      name: item.name || 'Desconocida',
      value: Number(item.value),
    }));

    // --- B. Casos por Gravedad (Variante) ---
    let qSeverity = this.logRepo
      .createQueryBuilder('log')
      .select('log.resultVariant', 'variant')
      .addSelect('COUNT(log.id)', 'count')
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

    // --- C. Casos por Ciudad (Usando JOIN múltiple) ---
    let qCity = this.logRepo
      .createQueryBuilder('log')
      .leftJoin('province', 'p', 'p.id = log.province_id')
      .leftJoin('city', 'c', 'c.id = log.city_id') // JOIN con tabla ciudad
      .select('p.name', 'province')
      .addSelect('c.name', 'city')
      .addSelect('COUNT(log.id)', 'value')
      .groupBy('p.name')
      .addGroupBy('c.name')
      .orderBy('value', 'DESC');

    qCity = applyFilter(qCity);

    const byCityRaw = await qCity.getRawMany();
    const byCity = byCityRaw.map((item) => ({
      province: item.province || 'Desconocida',
      city: item.city || 'Desconocida',
      value: Number(item.value),
    }));

    // --- D. EVOLUCIÓN TEMPORAL ---
    let qTrend = this.logRepo
      .createQueryBuilder('log')
      .select("TO_CHAR(log.createdAt, 'YYYY-MM-DD')", 'date')
      .addSelect('COUNT(log.id)', 'value')
      .groupBy("TO_CHAR(log.createdAt, 'YYYY-MM-DD')")
      .orderBy('date', 'ASC');

    qTrend = applyFilter(qTrend);

    const byTrendRaw = await qTrend.getRawMany();
    const byTrend = byTrendRaw.map((item) => ({
      date: item.date,
      value: Number(item.value),
    }));

    // --- E. POR TIPO DE DIAGNÓSTICO ---
    let qDiagnosis = this.logRepo
      .createQueryBuilder('log')
      .select('log.diagnosisType', 'name')
      .addSelect('COUNT(log.id)', 'value')
      .groupBy('log.diagnosisType');

    qDiagnosis = applyFilter(qDiagnosis);

    const byDiagnosisRaw = await qDiagnosis.getRawMany();
    const byDiagnosis = byDiagnosisRaw.map((item) => ({
      name: item.name || 'Sin especificar',
      value: Number(item.value),
    }));

    // --- F. POR RANGO DE PESO ---
    let qWeight = this.logRepo
      .createQueryBuilder('log')
      .select('log.patientWeightRange', 'name')
      .addSelect('COUNT(log.id)', 'value')
      .groupBy('log.patientWeightRange');

    qWeight = applyFilter(qWeight);

    const byWeightRaw = await qWeight.getRawMany();
    const byWeight = byWeightRaw.map((item) => ({
      name: item.name || 'No registrado',
      value: Number(item.value),
    }));

    // --- G. POR GRUPO DE RIESGO ---
    let qRisk = this.logRepo
      .createQueryBuilder('log')
      .select('log.isRiskGroup', 'isRisk')
      .addSelect('COUNT(log.id)', 'value')
      .groupBy('log.isRiskGroup');

    qRisk = applyFilter(qRisk);

    const byRiskRaw = await qRisk.getRawMany();
    const byRisk = byRiskRaw.map((item) => ({
      name:
        item.isRisk === true || item.isRisk === 'true'
          ? 'Grupo de Riesgo'
          : 'Población General',
      value: Number(item.value),
    }));

    return {
      byProvince,
      bySeverity,
      byCity,
      byTrend,
      byDiagnosis,
      byWeight,
      byRisk,
    };
  }
}
