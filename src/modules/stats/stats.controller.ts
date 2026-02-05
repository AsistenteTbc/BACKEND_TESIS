import { Controller, Get, Post, Body, Query } from '@nestjs/common';
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
    // Pasamos los 3 parámetros al servicio
    return await this.statsService.getDashboardStats(province, from, to);
  }
}
