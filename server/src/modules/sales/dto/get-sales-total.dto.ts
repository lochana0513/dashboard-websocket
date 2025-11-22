import { IsString } from 'class-validator';

export class GetSalesTotalDto {
  @IsString()
  productType: string; // 'Acme Professional' | 'Acme Advanced' | 'Acme Plus'
}
