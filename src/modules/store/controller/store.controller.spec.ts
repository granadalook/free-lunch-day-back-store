import { Test, TestingModule } from '@nestjs/testing';
import { StoreController } from './store.controller';
import { StoreService } from '../service/store.service';
import { DatabaseService } from '../../database/service/database.service';
import { MarketService } from '../../market/service/market.service';
import { HttpModule } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { OrderDto, RecipeDto } from '../dto/order.dto';

describe('StoreController', () => {
  let controller: StoreController;
  let storeService: StoreService;
  let databaseService: DatabaseService;
  const mockRecipeDto: RecipeDto = {
    cheese: 1,
    tomato: 1,
  };
  const mockOrderDto: OrderDto = {
    codeOrder: 0,
    id: '',
    recipe: mockRecipeDto,
  };
  const mockVisitMarket = [
    {
      tomato: 1,
      cheese: 1,
    },
  ];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        MarketService,
        {
          provide: StoreService,
          useValue: {
            createOrder: jest.fn(),
          },
        },
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
            getListIngredients: jest.fn().mockReturnValue(mockRecipeDto),
            getVisitMarket: jest.fn().mockReturnValue(mockVisitMarket),
            updateListIngredients: jest.fn().mockReturnValue(true),
            statusOrder: jest.fn().mockReturnValue(true),
          },
        },
      ],
      controllers: [StoreController],
    }).compile();

    controller = module.get<StoreController>(StoreController);
    storeService = module.get<StoreService>(StoreService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('kitchenMessage', () => {
    it('debe llamar a storeService.createOrder con el payload correcto', () => {
      const loggerSpy = jest.spyOn(Logger, 'log').mockImplementation(() => {});
      controller.kitchenMessage(mockOrderDto);
      expect(loggerSpy).toHaveBeenCalledWith(
        mockOrderDto.recipe,
        StoreController.name,
      );
      expect(storeService.createOrder).toHaveBeenCalledWith(mockOrderDto);
      loggerSpy.mockRestore();
    });
  });
  describe('getIngredients', () => {
    it('debe retornar la lista de ingredientes disponibles', () => {
      const result = controller.getIngredients();
      expect(databaseService.getListIngredients).toHaveBeenCalled();
      expect(result).toBe(mockRecipeDto);
    });
  });
  describe('getVisits', () => {
    it('debe retornar las visitas al mercado', () => {
      const result = controller.getVisits();
      expect(databaseService.getVisitMarket).toHaveBeenCalled();
      expect(result).toBe(mockVisitMarket);
    });
  });
});
