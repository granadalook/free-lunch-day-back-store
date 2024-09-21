import { Controller, Logger } from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrderDto } from '../dto/order.dto';
import { KafkaTopicsConstants } from '../../constants/kafka.topics';

@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @MessagePattern(KafkaTopicsConstants.CREATE_ORDER_TOPIC)
  kitchenMessage(@Payload() payload: OrderDto) {
    Logger.log(payload.recipe, StoreController.name);
    this.storeService.createOrder(payload);
  }
}
