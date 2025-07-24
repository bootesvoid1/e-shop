import { IsInt, IsNotEmpty, IsNumber, IsObject, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  price: number; // Optional: you can fetch and override it from product service if needed

  @IsObject()
  selectedVariants: Record<string, string>; // e.g., { "Color": "Black", "Size": "L" }
}
