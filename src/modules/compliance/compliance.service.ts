import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ComplianceService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async isWhitelisted(address: string): Promise<boolean> {
    const status = await this.cacheManager.get<boolean>(
      `whitelist:${address.toLowerCase()}`,
    );
    return status ?? false;
  }

  async updateWhitelistStatus(address: string, status: boolean) {
    await this.cacheManager.set(
      `whitelist:${address.toLowerCase()}`,
      status,
      0,
    );
  }
}
