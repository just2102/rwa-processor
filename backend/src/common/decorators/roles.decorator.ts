import { Reflector } from '@nestjs/core';
import { Role } from '../constants';

export const Roles = Reflector.createDecorator<Role[]>();
