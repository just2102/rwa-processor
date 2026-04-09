import { Injectable } from '@nestjs/common';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { BlockchainService } from './blockchain.service';
import { Hex } from 'viem';

@Injectable()
export class BlockchainWorker {
  constructor(private readonly blockchainService: BlockchainService) {}

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'tx.mint',
    queue: 'rwa-mint-queue',
  })
  public async handleMint(msg: {
    address: string;
    amount: string;
    chainId: number;
  }) {
    try {
      console.log(`🚀 Processing Mint for ${msg.address}...`);

      const data = ('0x40c10f19' +
        msg.address.replace('0x', '').padStart(64, '0') +
        BigInt(msg.amount).toString(16).padStart(64, '0')) as Hex;

      const tx = await this.blockchainService.sendRwaTransaction({
        to: '0x1',
        data,
        chainId: msg.chainId,
      });

      console.log(`✅ Transaction Broadcast: ${tx}`);
    } catch (error) {
      console.error('❌ Blockchain Worker Error:', error);

      // re-queue
      return new Nack(true);
    }
  }
}
