import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { MarketSold } from '../dto/merket.dto';

@Injectable()
export class MarketService {
  constructor(private httpService: HttpService) {}
  async buyMarket(product: string): Promise<{ [key: string]: number }> {
    let quantitySold = 0;
    let attempts = 0;
    const maxAttempts = 5; // Máximo de 5 intentos
    while (quantitySold === 0 && attempts < maxAttempts) {
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
    return { [product]: quantitySold };
  }
}
