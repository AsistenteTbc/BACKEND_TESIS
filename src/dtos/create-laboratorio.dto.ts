import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateLaboratorioDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  horario?: string;

  @IsNumber()
  @IsNotEmpty()
  provinceId: number;

  // 👇 AGREGAR ESTO:
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
