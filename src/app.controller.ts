import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('steps')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/provinces')
  getProvinces() {
    return this.appService.getProvinces();
  }

  @Get(':id')
  getStep(@Param('id') id: string) {
    return this.appService.getStep(Number(id));
  }

  @Get('/provinces/:provinceId/cities')
  getCitiesByProvince(@Param('provinceId') provinceId: string) {
    return this.appService.getCitiesByProvince(Number(provinceId));
  }
  
  @Get('/laboratorios/:cityId')
  getLaboratorios(@Param('cityId') cityId: string) {
    return this.appService.getLaboratorios(Number(cityId));
  }
  
}
