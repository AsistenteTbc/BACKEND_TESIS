import { Controller, Get, Post, Body, Query, BadRequestException } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ConsultationLog } from '../../entities/consultationLog';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Post('log')
  async logConsultation(@Body() data: Partial<ConsultationLog>) {
    return await this.statsService.logConsultation(data);
  }

  @Get('dashboard')
  async getDashboardStats(
    @Query('province') province?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    // ✅ VALIDACIÓN: Si ambas fechas están presentes, validar que from <= to
    if (from && to && from > to) {
      throw new BadRequestException(
        'La fecha "desde" no puede ser posterior a la fecha "hasta"'
      );
    }

    // Pasamos los 3 parámetros al servicio
    return await this.statsService.getDashboardStats(province, from, to);
  }
}
