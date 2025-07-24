import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManufacturorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  details: string;
}
