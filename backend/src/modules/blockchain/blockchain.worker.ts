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
        to: '0x1111111111111111111111111111111111111111', // Dummy valid address length
        data,
        chainId: msg.chainId,
      });

      console.log(`✅ Transaction Broadcast: ${tx}`);
    } catch (error) {
      console.error('❌ Blockchain Worker Error:', error);

      // We do NOT want to infinitely requeue on persistent errors like Redis going down.
      // Changing this to false will drop the message (or send it to a Dead Letter Exchange if configured).
      return new Nack(false);
    }
  }
}
