import { Controller, Logger, Get } from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDto, RecipeDto } from '../dto/order.dto';
import { KafkaTopicsConstants } from '../../constants/kafka.topics';
import { DatabaseService } from '../../database/service/database.service';

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
  getIngredients(): RecipeDto {
    return this.databaseService.getListIngredients();
  }

  @Get('visitsMarket')
  getVisits(): Array<{ product: string; amount: number }> {
    return this.databaseService.getVisitMarket();
  }
}
