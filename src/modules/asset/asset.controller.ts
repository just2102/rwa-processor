import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AssetService } from './asset.service';
import { MintTokensDto } from './dto/mint-tokens.dto';
import { ApiKeyGuard, RolesGuard, Roles, Role } from 'src/common';

@Controller('assets')
@UseGuards(ApiKeyGuard, RolesGuard)
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post('mint')
  @Roles([Role.Admin])
  async mint(@Body() mintTokensDto: MintTokensDto) {
    return this.assetService.mintTokens(mintTokensDto);
  }
}
