import { IsString } from 'class-validator';

export class GetSalesChartDto {
  @IsString()
  productType: string; // 'Acme Professional' | 'Acme Advanced' | 'Acme Plus'
}
