import { Platform } from 'react-native';
import pino from 'pino';

const isTest = process.env.NODE_ENV === 'test';
const isDevelopment =
  typeof __DEV__ !== 'undefined'
    ? __DEV__
    : process.env.NODE_ENV !== 'production';

export const appLogger = pino({
  name: 'jiu-tracker-mobile',
  enabled: !isTest,
  level: isTest ? 'silent' : isDevelopment ? 'debug' : 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    app: 'jiu-tracker-mobile',
    platform: Platform.OS,
  },
  browser: {
    asObject: true,
    serialize: true,
  },
});

export function createLogger(scope: string) {
  return appLogger.child({ scope });
}

export function serializeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}
