import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { DatabaseService } from '../../database/service/database.service';
import { MarketService } from '../../market/service/market.service';
import { HttpModule } from '@nestjs/axios';
import { KafkaTopicsConstants } from '../../constants/kafka.topics';
import { StatusOrderEnum } from '../../constants/status.order.enum';
import { OrderDto, RecipeDto } from '../dto/order.dto';
import { ClientProxy } from '@nestjs/microservices';

describe('StoreService', () => {
  let service: StoreService;
  let kafkaService: ClientProxy;
  let databaseService: DatabaseService;
  let marketService: MarketService;

  const updatedIngredients: RecipeDto = {
    tomato: 2,
    cheese: 4,
  };
  const mockRecipeDto: RecipeDto = {
    cheese: 5,
    tomato: 5,
  };

  const mockOrder: OrderDto = {
    id: 'order123',
    recipe: {
      tomato: 3,
      cheese: 1,
    },
    codeOrder: 0,
  };
  const mockVisitMarket = [
    {
      tomato: 1,
      cheese: 1,
    },
  ];

  beforeEach(async () => {
    const kafkaServiceProvider = {
      provide: 'KAFKA_CLIENT',
      useValue: {
        emit: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        kafkaServiceProvider,
        {
          provide: MarketService,
          useValue: {
            buyMarket: jest.fn(),
          },
        },
        StoreService,
        {
          provide: 'KAFKA_CLIENT',
          useValue: {
            emit: jest.fn(() => {
              return 'created';
            }),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            statusOrder: jest.fn().mockReturnValue(true),
            updateListIngredients: jest.fn(),
            getListIngredients: jest.fn().mockReturnValue(mockRecipeDto),
            addVisitMarket: jest.fn().mockReturnValue(mockVisitMarket),
            updateIngredients: jest.fn().mockReturnValue(mockRecipeDto),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
    kafkaService = module.get<ClientProxy>('KAFKA_CLIENT');
    marketService = module.get<MarketService>(MarketService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createOrder', () => {
    it('debe emitir el estado IN_PROGREST y actualizar los ingredientes', async () => {
      await service.createOrder(mockOrder);
      expect(kafkaService.emit).toHaveBeenCalledWith(
        KafkaTopicsConstants.UPDATE_STATUS_TOPIC,
        { id: mockOrder.id, status: StatusOrderEnum.IN_PROGREST },
      );
      expect(databaseService.updateListIngredients).toHaveBeenCalledWith(
        updatedIngredients,
      );
    });
  });
  describe('buyMissingIngredients', () => {
    it('debe comprar ingredientes faltantes y actualizar la lista', async () => {
      const updatedIngredients = {
        tomato: 15,
        cheese: 7,
      };
      (databaseService.getListIngredients as jest.Mock).mockResolvedValueOnce({
        tomato: 1,
        cheese: 5,
      });
      (marketService.buyMarket as jest.Mock).mockResolvedValueOnce({
        tomato: 10,
      });
      (databaseService.updateIngredients as jest.Mock).mockResolvedValueOnce(
        updatedIngredients,
      );
      const result = await service['buyMissingIngredients'](mockOrder.recipe);
      expect(marketService.buyMarket).toHaveBeenCalledWith('tomato', 3);
      expect(databaseService.updateIngredients).toHaveBeenCalledWith({
        tomato: 10,
      });
      expect(result).toEqual(updatedIngredients);
    });
  });
});
