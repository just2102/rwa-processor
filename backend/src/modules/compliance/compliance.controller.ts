import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { UpdateWhitelistDto } from './dto/update-whitelist.dto';
import { ApiKeyGuard, RolesGuard, Role, Roles } from 'src/common';

@Controller('compliance')
@UseGuards(ApiKeyGuard, RolesGuard)
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post('whitelist')
  @HttpCode(HttpStatus.OK)
  @Roles([Role.Admin, Role.Compliance])
  async updateStatus(@Body() dto: UpdateWhitelistDto) {
    return this.complianceService.updateWhitelistStatus(
      dto.address,
      dto.status,
    );
  }
}
