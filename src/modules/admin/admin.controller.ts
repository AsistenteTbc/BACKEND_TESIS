import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // =================================================================
  // 1. PROVINCIAS
  // =================================================================
  @Get('provinces')
  getAllProvinces() {
    return this.adminService.getProvinces();
  }

  @Post('provinces')
  createProvince(@Body() data: any) {
    return this.adminService.createProvince(data);
  }

  @Put('provinces/:id')
  updateProvince(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateProvince(+id, data);
  }

  @Delete('provinces/:id')
  deleteProvince(@Param('id') id: string) {
    return this.adminService.deleteProvince(+id);
  }

  // =================================================================
  // 2. CIUDADES
  // =================================================================
  @Get('cities')
  getAllCities() {
    return this.adminService.getCities();
  }

  @Post('cities')
  createCity(@Body() data: any) {
    return this.adminService.createCity(data);
  }

  @Put('cities/:id')
  updateCity(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateCity(+id, data);
  }

  @Delete('cities/:id')
  deleteCity(@Param('id') id: string) {
    return this.adminService.deleteCity(+id);
  }

  // =================================================================
  // 3. LABORATORIOS (¡NUEVO!)
  // =================================================================
  @Get('laboratorios')
  getAllLaboratorios() {
    return this.adminService.getLaboratorios();
  }

  @Post('laboratorios')
  createLaboratorio(@Body() data: any) {
    return this.adminService.createLaboratorio(data);
  }

  @Put('laboratorios/:id')
  updateLaboratorio(@Param('id') id: string, @Body() data: any) {
    return this.adminService.updateLaboratorio(+id, data);
  }

  @Delete('laboratorios/:id')
  deleteLaboratorio(@Param('id') id: string) {
    return this.adminService.deleteLaboratorio(+id);
  }
}
