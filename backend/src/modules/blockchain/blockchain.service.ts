import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { createWalletClient, Hex, http, WalletClient } from 'viem';
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

  onModuleInit() {
    for (const chain of Object.values(SUPPORTED_CHAINS)) {
      // todo: use chain-specific rpc and pks
      const rpcToUse = chain.rpcUrls.default.http[0] ?? '';
      const pkToUse = this.config.get('blockchain.privateKey');

      if (!pkToUse) {
        throw new Error('Private key is not defined');
      }

      const client = createWalletClient({
        chain,
        transport: http(rpcToUse),
        account: privateKeyToAccount(pkToUse),
      });
      this.walletClients[chain.id] = client;
    }
  }

  async getNextNonce(chainId: number): Promise<number> {
    if (!this.walletClients[chainId] || !this.walletClients[chainId].account) {
      throw new Error('Wallet client is not initialized');
    }

    const redis = this.redisService.getOrThrow();
    const key = `nonce:${this.walletClients[chainId].account.address.toLowerCase()}`;

    return await redis.incr(key);
  }

  async sendRwaTransaction({
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

    const nonce = await this.getNextNonce(chainId);

    // subtract 1 because 'incr' starts at 1, but Ethereum nonces start at 0
    const txResponse = await this.walletClients[chainId].sendTransaction({
      to,
      data,
      chain: this.walletClients[chainId].chain,
      account: this.walletClients[chainId].account,
      nonce: nonce - 1,
      gasLimit: 200000,
    });

    return txResponse;
  }
}
