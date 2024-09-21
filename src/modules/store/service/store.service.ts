import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DatabaseService } from 'src/modules/database/service/database.service';
import { MarketService } from 'src/modules/market/service/market.service';
import { OrderDto, RecipeDto } from '../dto/order.dto';
import { KafkaTopicsConstants } from '../../constants/kafka.topics';
import { StatusOrderEnum } from '../../constants/status.order.enum';

@Injectable()
export class StoreService {
  constructor(
    @Inject('KAFKA_CLIENT') private kafkaService: ClientProxy,
    private databaseService: DatabaseService,
    private marketService: MarketService,
  ) {}

  async createOrder(order: OrderDto): Promise<void> {
    const availableIngredients = this.databaseService.getListIngredients();
    const updateStatus = {
      id: order.id,
      status: StatusOrderEnum.IN_PROGREST,
    };
    this.kafkaService.emit(
      KafkaTopicsConstants.UPDATE_STATUS_TOPIC,
      updateStatus,
    );
    const newAvailableIngredients = await this.useIngredients(
      order.id,
      order.recipe,
      availableIngredients,
    );
    this.databaseService.updateListIngredients(newAvailableIngredients);
  }

  async useIngredients(
    idOrder: string,
    requiredIngredients: RecipeDto,
    availableIngredients: RecipeDto,
  ): Promise<RecipeDto> {
    availableIngredients = await this.buyMissingIngredients(
      requiredIngredients,
      availableIngredients,
    );

    this.deductIngredients(requiredIngredients, availableIngredients);
    const updateStatus = {
      id: idOrder,
      status: StatusOrderEnum.DELIVERED,
    };
    this.kafkaService.emit(
      KafkaTopicsConstants.UPDATE_STATUS_TOPIC,
      updateStatus,
    );
    return availableIngredients;
  }

  private async buyMissingIngredients(
    requiredIngredients: RecipeDto,
    availableIngredients: RecipeDto,
  ): Promise<RecipeDto> {
    for (const [ingredient, requiredAmount] of Object.entries(
      requiredIngredients,
    )) {
      if (requiredAmount !== undefined) {
        if (
          !availableIngredients[ingredient] ||
          availableIngredients[ingredient] < requiredAmount
        ) {
          const buy = await this.marketService.buyMarket(ingredient);
          availableIngredients = this.databaseService.updateIngredients(buy);
        }
      }
    }
    return availableIngredients;
  }

  private deductIngredients(
    requiredIngredients: RecipeDto,
    availableIngredients: RecipeDto,
  ) {
    for (const [ingredient, requiredAmount] of Object.entries(
      requiredIngredients,
    )) {
      if (requiredAmount !== undefined) {
        availableIngredients[ingredient] -= requiredAmount;
      }
    }
  }
}
