import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { MarketService } from './market.service';
import { DatabaseService } from '../../database/service/database.service';
import { AxiosResponse } from 'axios';
import { MarketSold } from '../dto/merket.dto';

describe('MarketService', () => {
  let service: MarketService;
  let httpService: HttpService;
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: DatabaseService,
          useValue: {
            addVisitMarket: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MarketService>(MarketService);
    httpService = module.get<HttpService>(HttpService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buyMarket', () => {
    it('debe realizar múltiples intentos y devolver la cantidad vendida', async () => {
      const mockResponse: AxiosResponse<MarketSold> = {
        data: { quantitySold: 5 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };
      (httpService.get as jest.Mock).mockReturnValue(of(mockResponse));
      const result = await service.buyMarket('tomato', 5);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://recruitment.alegra.com/api/farmers-market/buy?ingredient=tomato',
      );
      expect(databaseService.addVisitMarket).toHaveBeenCalledWith('tomato', 5);
      expect(result).toEqual({ tomato: 5 });
    });

    it('debe manejar errores HTTP al hacer la solicitud', async () => {
      (httpService.get as jest.Mock).mockReturnValue(
        throwError(() => new Error('HTTP error')),
      );
      await expect(service.buyMarket('tomato', 5)).rejects.toThrow(
        'HTTP error',
      );

      expect(httpService.get).toHaveBeenCalled();
    });
  });
});
