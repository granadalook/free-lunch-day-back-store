import { ApiProperty } from '@nestjs/swagger';

export class RecipeDto {
  @ApiProperty({
    description: 'Cantidad de tomate',
    required: false,
    example: '5',
  })
  tomato?: number;

  @ApiProperty({
    description: 'Cantidad de limón',
    required: false,
    example: '5',
  })
  lemon?: number;

  @ApiProperty({
    description: 'Cantidad de papa',
    required: false,
    example: '5',
  })
  potato?: number;

  @ApiProperty({
    description: 'Cantidad de arroz',
    required: false,
    example: '5',
  })
  rice?: number;

  @ApiProperty({
    description: 'Cantidad de ketchup',
    required: false,
    example: '5',
  })
  ketchup?: number;

  @ApiProperty({
    description: 'Cantidad de lechuga',
    required: false,
    example: '5',
  })
  lettuce?: number;

  @ApiProperty({
    description: 'Cantidad de cebolla',
    required: false,
    example: '5',
  })
  onion?: number;

  @ApiProperty({
    description: 'Cantidad de queso',
    required: false,
    example: '5',
  })
  cheese?: number;

  @ApiProperty({
    description: 'Cantidad de carne',
    required: false,
    example: '5',
  })
  meat?: number;

  @ApiProperty({
    description: 'Cantidad de pollo',
    required: false,
    example: '5',
  })
  chicken?: number;
}

export class OrderDto {
  @ApiProperty({
    description: 'Código del pedido',
    examples: ['1', '2', '3', '4', '5', '6'],
  })
  codeOrder: number;

  @ApiProperty({ description: 'ID único del pedido', example: 'uuid' })
  id: string;

  @ApiProperty({ description: 'Receta asociada al pedido' })
  recipe: RecipeDto;
}

export class VisitsMarket {
  @ApiProperty({ description: 'Nombre del producto', example: 'tomato' })
  product: string;

  @ApiProperty({ description: 'Cantidad del producto', example: '5' })
  amount: number;
}
