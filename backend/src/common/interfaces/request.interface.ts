import { Request } from 'express';
import { Role } from '../constants';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: Role[];
  };
}
