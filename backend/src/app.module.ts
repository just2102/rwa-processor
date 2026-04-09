import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { AssetModule, BlockchainModule, ComplianceModule } from './modules';
import { CommonModule, RabbitMQGlobalModule } from './common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config';

@Module({
  imports: [
    // Configuration
    // https://docs.nestjs.com/techniques/configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CommonModule,
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379,
        password: undefined,
      },
    }),
    CacheModule.register({
      stores: [new KeyvRedis('redis://localhost:6379')],
      isGlobal: true,
    }),
    RabbitMQGlobalModule,
    AssetModule,
    BlockchainModule,
    ComplianceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
