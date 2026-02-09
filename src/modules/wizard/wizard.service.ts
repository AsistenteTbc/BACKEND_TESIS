import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Step } from '../../entities/step.entity';

@Injectable()
export class WizardService {
  constructor(
    @InjectRepository(Step)
    private stepRepository: Repository<Step>,
  ) {}

  async getStep(id: number): Promise<Step | null> {
    return this.stepRepository.findOne({
      where: { id },
      relations: ['options'],
    });
  }
}
