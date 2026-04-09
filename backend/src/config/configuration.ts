import path from 'node:path';
import { pathToFileURL } from 'node:url';

import type {
  Config,
  Default,
  Objectype,
  Production,
} from './config.interface';

function isObject(value: unknown): value is Objectype {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function merge<T extends Objectype, U extends Objectype>(
  target: T,
  source: U,
): T & U {
  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];
    if (isObject(targetValue) && isObject(sourceValue)) {
      Object.assign(sourceValue, merge(targetValue, sourceValue));
    }
  }

  return { ...target, ...source };
}

export const configuration = async (): Promise<Config> => {
  const { config } = <{ config: Default }>(
    await import(pathToFileURL(path.join(__dirname, 'envs', 'default.js')).href)
  );
  const envFile =
    process.env.NODE_ENV === 'production' ? 'production.js' : 'default.js';
  const { config: environment } = <{ config: Production }>(
    await import(pathToFileURL(path.join(__dirname, 'envs', envFile)).href)
  );

  return merge(config, environment);
};
