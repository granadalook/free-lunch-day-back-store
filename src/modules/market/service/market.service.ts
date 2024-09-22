import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { MarketSold } from '../dto/merket.dto';
import { DatabaseService } from '../../database/service/database.service';

@Injectable()
export class MarketService {
  constructor(
    private httpService: HttpService,
    private databaseService: DatabaseService,
  ) {}
  async buyMarket(
    product: string,
    requiredAmount: number,
  ): Promise<{ [key: string]: number }> {
    let quantitySold = 0;
    let attempts = 0;
    const maxAttempts = 5;
    while (
      quantitySold === 0 ||
      (requiredAmount > quantitySold && attempts < maxAttempts)
    ) {
      const { data: resp }: any = await lastValueFrom(
        this.httpService.get<MarketSold>(
          `https://recruitment.alegra.com/api/farmers-market/buy?ingredient=${product}`,
        ),
      );
      quantitySold = resp.quantitySold;
      attempts++;
    }
    if (quantitySold === 0) {
      throw new Error(
        'No se pudo obtener una cantidad válida después de varios intentos',
      );
    }
    await this.databaseService.addVisitMarket(product, quantitySold);
    return { [product]: quantitySold };
  }
}
