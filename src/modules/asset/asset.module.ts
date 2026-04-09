import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';

@Module({
  imports: [],
  providers: [AssetService],
  controllers: [AssetController],
})
export class AssetModule {}
