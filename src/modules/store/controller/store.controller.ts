import { Controller, Logger, Get } from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDto, RecipeDto, VisitsMarket } from '../dto/order.dto';
import { KafkaTopicsConstants } from '../../constants/kafka.topics';
import { DatabaseService } from '../../database/service/database.service';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('STORE AND MARKET')
@Controller('store')
export class StoreController {
  constructor(
    private storeService: StoreService,
    private databaseService: DatabaseService,
  ) {}

  @MessagePattern(KafkaTopicsConstants.CREATE_ORDER_TOPIC)
  kitchenMessage(@Payload() payload: OrderDto) {
    Logger.log(payload.recipe, StoreController.name);
    this.storeService.createOrder(payload);
  }

  @Get('availableIngredients')
  @ApiOperation({
    summary: 'Obtener ingredientes disponibles',
    description: 'Lista  de ingredientes disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ingredientes disponibles',
    type: RecipeDto,
  })
  getIngredients(): RecipeDto {
    return this.databaseService.getListIngredients();
  }

  @Get('visitsMarket')
  @ApiOperation({
    summary: 'Obtener visitas al mercado',
    description: 'las visitas realizadas el mercado para compra de productos',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de visitas al mercado',
    type: [VisitsMarket],
  })
  getVisits(): Array<VisitsMarket> {
    return this.databaseService.getVisitMarket();
  }
}
