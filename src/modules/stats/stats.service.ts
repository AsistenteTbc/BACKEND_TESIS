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

  // --- RECUERDA: Esta función NO debe borrarse ---
  async logConsultation(data: Partial<ConsultationLog>) {
    const log = this.logRepo.create(data);
    return await this.logRepo.save(log);
  }

  async getDashboardStats(provinceFilter?: string, from?: string, to?: string) {
    if (from && to && from > to) {
      throw new Error('La fecha "desde" no puede ser posterior a la fecha "hasta"');
    }

    const applyFilter = (query: any) => {
      if (provinceFilter && provinceFilter !== 'TODAS') {
        query.andWhere('log.provinceId = :provinceId', {
          provinceId: Number(provinceFilter),
        });
      }

      if (from) {
        query.andWhere('log.createdAt >= :from', { from: `${from} 00:00:00` });
      }
      if (to) {
        query.andWhere('log.createdAt <= :to', { to: `${to} 23:59:59` });
      }
      return query;
    };

    // --- A. Provincias (CON JOIN) ---
    let qProvince = this.logRepo.createQueryBuilder('log')
      .leftJoin('province', 'p', 'p.id = log.provinceId') 
      .select('p.name', 'name')
      .addSelect('COUNT(log.id)', 'value')
      .groupBy('p.name');
    const byProvince = (await applyFilter(qProvince).getRawMany()).map(i => ({ name: i.name || 'Desconocida', value: Number(i.value) }));

    // --- B. Severidad ---
    let qSev = this.logRepo.createQueryBuilder('log')
      .select('log.resultVariant', 'variant').addSelect('COUNT(log.id)', 'count').groupBy('log.resultVariant');
    const bySeverity = (await applyFilter(qSev).getRawMany()).map(s => ({
      name: s.variant === 3 ? 'Priorizado (GeneXpert)' : s.variant === 2 ? 'Estándar' : s.variant === 4 ? 'Urgente Extra' : 'Info',
      value: Number(s.count),
    }));

    // --- C. Ciudades (CON JOIN) ---
    let qCity = this.logRepo.createQueryBuilder('log')
      .leftJoin('province', 'p', 'p.id = log.provinceId')
      .leftJoin('city', 'c', 'c.id = log.cityId')
      .select('p.name', 'province').addSelect('c.name', 'city').addSelect('COUNT(log.id)', 'value')
      .groupBy('p.name').addGroupBy('c.name');
    const byCity = (await applyFilter(qCity).getRawMany()).map(i => ({ province: i.province, city: i.city, value: Number(i.value) }));

    // --- D. Evolución ---
    let qTrend = this.logRepo.createQueryBuilder('log')
      .select("TO_CHAR(log.createdAt, 'YYYY-MM-DD')", 'date').addSelect('COUNT(log.id)', 'value')
      .groupBy("TO_CHAR(log.createdAt, 'YYYY-MM-DD')").orderBy('date', 'ASC');
    const byTrend = (await applyFilter(qTrend).getRawMany()).map(i => ({ date: i.date, value: Number(i.value) }));

    // --- E, F, G ---
    const getStat = async (field: string) => {
      let q = this.logRepo.createQueryBuilder('log').select(`log.${field}`, 'name').addSelect('COUNT(log.id)', 'value').groupBy(`log.${field}`);
      return (await applyFilter(q).getRawMany()).map(i => ({ name: i.name || 'N/A', value: Number(i.value) }));
    };

    const byDiagnosis = await getStat('diagnosisType');
    const byWeight = await getStat('patientWeightRange');
    const byRiskRaw = await getStat('isRiskGroup');
    const byRisk = byRiskRaw.map(i => ({ name: i.name === true || i.name === 'true' ? 'Grupo de Riesgo' : 'Población General', value: i.value }));

    return { byProvince, bySeverity, byCity, byTrend, byDiagnosis, byWeight, byRisk };
  }
}