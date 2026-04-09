import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { MintTokensDto } from './dto/mint-tokens.dto';

@Injectable()
export class AssetService {
  constructor(private readonly amqp: AmqpConnection) {}

  /**
   * Dispatches a minting request to the RabbitMQ exchange.
   * @param dto - Validated minting parameters from the frontend.
   */
  async mintTokens(dto: MintTokensDto): Promise<void> {
    await this.amqp.publish('exchange1', 'tx.mint', {
      ...dto,
      timestamp: Date.now(),
    });
  }
}
