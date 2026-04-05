import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../constants';
import { AuthenticatedRequest } from '../interfaces';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const apiKey = request.headers['x-api-key'];

    // todo: add env
    const VALID_API_KEY = 'not_a_secret';

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
