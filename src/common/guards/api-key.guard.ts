import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '../constants';
import { AuthenticatedRequest } from '../interfaces';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const apiKey = request.headers['x-api-key'];

    const VALID_API_KEY = this.config.get<string>('API_KEY');

    if (apiKey !== VALID_API_KEY) {
      throw new UnauthorizedException('Invalid or missing API Key');
    }

    request.user = {
      id: 'system_admin',
      roles: [Role.Admin],
    };

    return true;
  }
}
