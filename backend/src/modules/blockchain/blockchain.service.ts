import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import {
  createPublicClient,
  createWalletClient,
  Hex,
  http,
  PublicClient,
  WalletClient,
} from 'viem';
import { Address, privateKeyToAccount } from 'viem/accounts';
import { SUPPORTED_CHAINS } from 'src/common';
import { ConfigService } from 'src/common/providers';

@Injectable()
export class BlockchainService implements OnModuleInit {
  constructor(
    private readonly redisService: RedisService,
    private config: ConfigService,
  ) {}

  //   mapping by chainId
  private walletClients: Record<number, WalletClient> = {};
  private publicClients: Record<number, PublicClient> = {};
  private readonly logger = new Logger(BlockchainService.name);

  async onModuleInit() {
    const pkToUse = this.config.get('blockchain.privateKey');
    if (!pkToUse) throw new Error('Private key is not defined');
    const account = privateKeyToAccount(pkToUse);

    for (const chain of Object.values(SUPPORTED_CHAINS)) {
      const rpcToUse = chain.rpcUrls.default.http[0] ?? '';

      this.publicClients[chain.id] = createPublicClient({
        chain,
        transport: http(rpcToUse),
      });

      this.walletClients[chain.id] = createWalletClient({
        chain,
        transport: http(rpcToUse),
        account,
      });

      await this.syncNonceWithChain(chain.id, account.address);
    }
  }

  private async getNextNonce(chainId: number): Promise<number> {
    if (!this.walletClients[chainId] || !this.walletClients[chainId].account) {
      throw new Error('Wallet client is not initialized');
    }

    const redis = this.redisService.getOrThrow();
    const key = `nonce:${this.walletClients[chainId].account.address.toLowerCase()}`;

    // incr returns the new value
    return await redis.incr(key);
  }

  private async syncNonceWithChain(chainId: number, address: Address) {
    const redis = this.redisService.getOrThrow();
    const publicClient = this.publicClients[chainId];
    const key = `nonce:${address.toLowerCase()}`;

    const onChainNonce = await publicClient.getTransactionCount({ address });

    // only update redis if blockchain is ahead
    const currentRedisNonce = await redis.get(key);
    if (!currentRedisNonce || onChainNonce > parseInt(currentRedisNonce)) {
      await redis.set(key, onChainNonce);
      this.logger.log(`🔄 Synced Nonce for chain ${chainId}: ${onChainNonce}`);
    }
  }

  public async sendRwaTransaction({
    to,
    data,
    chainId,
  }: {
    to: Address;
    data: Hex;
    chainId: number;
  }) {
    if (!this.walletClients[chainId] || !this.walletClients[chainId].account) {
      throw new Error('Wallet client is not initialized');
    }
    if (!to) {
      throw new Error('To address is not defined on this chain');
    }

    const nonce = await this.getNextNonce(chainId);

    const txResponse = await this.walletClients[chainId].sendTransaction({
      to,
      data,
      chain: this.walletClients[chainId].chain,
      account: this.walletClients[chainId].account,
      nonce: nonce - 1,
    });

    return txResponse;
  }
}
