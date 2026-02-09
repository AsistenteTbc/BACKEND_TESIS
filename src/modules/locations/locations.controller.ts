import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateCityDto } from '../../dtos/create-city.dto';

@Controller()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  // === RUTAS PÚBLICAS (Para el Wizard) ===
  // Prefijo: /locations

  @Get('locations/provinces')
  getPublicProvinces() {
    return this.locationsService.findAllProvinces();
  }

  @Get('locations/provinces/:id/cities')
  getCitiesByProvince(@Param('id') id: string) {
    return this.locationsService.findCitiesByProvinceId(+id);
  }

  @Get('locations/laboratorios/:cityId')
  getLaboratorioByCity(@Param('cityId') cityId: string) {
    return this.locationsService.findLaboratorioByCityId(+cityId);
  }

  // === RUTAS ADMIN (Para el Panel)

  // --- PROVINCIAS ---
  @Get('admin/provinces')
  getAdminProvinces() {
    return this.locationsService.findAllProvinces();
  }

  @Post('admin/provinces')
  createProvince(@Body() data: { name: string }) {
    return this.locationsService.createProvince(data);
  }

  @Put('admin/provinces/:id')
  updateProvince(@Param('id') id: string, @Body() data: { name: string }) {
    return this.locationsService.updateProvince(+id, data);
  }

  @Delete('admin/provinces/:id')
  deleteProvince(@Param('id') id: string) {
    return this.locationsService.deleteProvince(+id);
  }

  // --- CIUDADES ---
  @Get('admin/cities')
  getAdminCities() {
    return this.locationsService.findAllCities();
  }

  @Post('admin/cities')
  createCity(@Body() data: CreateCityDto) {
    return this.locationsService.createCity(data);
  }

  @Put('admin/cities/:id')
  updateCity(@Param('id') id: string, @Body() data: Partial<CreateCityDto>) {
    return this.locationsService.updateCity(+id, data);
  }

  @Delete('admin/cities/:id')
  deleteCity(@Param('id') id: string) {
    return this.locationsService.deleteCity(+id);
  }
}
