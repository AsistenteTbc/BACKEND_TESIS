import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WizardController } from './wizard.controller';
import { WizardService } from './wizard.service';
import { Step } from '../../entities/step.entity';

//Este módulo se encargará exclusivamente de la lógica del cuestionario (Pasos y Opciones).

@Module({
  imports: [TypeOrmModule.forFeature([Step])],
  controllers: [WizardController],
  providers: [WizardService],
})
export class WizardModule {}
