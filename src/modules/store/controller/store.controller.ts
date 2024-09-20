import { Controller, Logger } from '@nestjs/common';
import { StoreService } from '../service/store.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @MessagePattern('kitchen-message')
  kitchenMessage(@Payload() payload: any) {
    Logger.log(payload, StoreController.name);
    return this.storeService.validateListFoot();
  }
}
