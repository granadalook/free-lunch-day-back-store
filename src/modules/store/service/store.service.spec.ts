import { Test, TestingModule } from '@nestjs/testing';
import { StoreService } from './store.service';
import { DatabaseService } from '../../database/service/database.service';
import { MarketService } from '../../market/service/market.service';
import { HttpModule } from '@nestjs/axios';

describe('StoreService', () => {
  let service: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        MarketService,
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
            /* getStatusList: jest.fn().mockReturnValue([orderStatusMock]),
            getRecipeByCode: jest.fn().mockReturnValue(recipeResultMock), */
            statusOrder: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<StoreService>(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
