import { Controller, Get, Param } from '@nestjs/common';
import { WizardService } from './wizard.service';

@Controller('steps') // Mantenemos la ruta 'steps' para no romper el frontend
export class WizardController {
  constructor(private readonly wizardService: WizardService) {}

  @Get(':id')
  getStep(@Param('id') id: string) {
    return this.wizardService.getStep(Number(id));
  }
}
