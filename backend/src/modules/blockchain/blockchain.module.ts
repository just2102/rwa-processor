import { Module } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { BlockchainWorker } from './blockchain.worker';

@Module({
  providers: [BlockchainService, BlockchainWorker],
  exports: [BlockchainService],
})
export class BlockchainModule {}
