import { Injectable } from '@nestjs/common';
import { RabbitSubscribe, Nack } from '@golevelup/nestjs-rabbitmq';
import { BlockchainService } from './blockchain.service';
import { Address, encodeFunctionData } from 'viem';
import { MintAbi } from 'src/common/constants/mint.abi';
import { MINT_CONTRACT_ADDRESS } from 'src/common';

@Injectable()
export class BlockchainWorker {
  constructor(private readonly blockchainService: BlockchainService) {}

  @RabbitSubscribe({
    exchange: 'exchange1',
    routingKey: 'tx.mint',
    queue: 'rwa-mint-queue',
  })
  public async handleMint(msg: {
    address: Address;
    amount: string;
    chainId: number;
  }) {
    try {
      console.log(`🚀 Processing Mint for ${msg.address}...`);

      const data = encodeFunctionData({
        abi: MintAbi,
        functionName: 'mint',
        args: [msg.address, BigInt(msg.amount)],
      });

      const tx = await this.blockchainService.sendRwaTransaction({
        to: MINT_CONTRACT_ADDRESS[msg.chainId],
        data,
        chainId: msg.chainId,
      });

      console.log(`✅ Transaction Broadcast: ${tx}`);
    } catch (error) {
      console.error('❌ Blockchain Worker Error:', error);

      return new Nack(false);
    }
  }
}
