export class CreateCityDto {
  name: string;
  zipCode: string;
  provinceId: number;
  laboratorioId?: number; // Opcional
}
