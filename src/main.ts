import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { createServer } from 'node:net';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap');
const DEFAULT_PORT = 8000;
const MAX_PORT_ATTEMPTS = 10;

async function bootstrap() {
  const preferredPort = getPreferredPort();
  logger.log(`Starting application with preferred port ${preferredPort}`);

  const app = await NestFactory.create(AppModule);
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    logger.warn(
      `Port ${preferredPort} is unavailable. Falling back to ${port}`,
    );
  }

  await app.listen(port);
  logger.log(`Application is running on ${await app.getUrl()}`);
}

function getPreferredPort(): number {
  const portValue = process.env.PORT;

  if (portValue === undefined) {
    return DEFAULT_PORT;
  }

  const parsedPort = Number.parseInt(portValue, 10);

  if (Number.isInteger(parsedPort) && parsedPort > 0) {
    return parsedPort;
  }

  logger.warn(
    `Invalid PORT value "${portValue}". Falling back to ${DEFAULT_PORT}`,
  );
  return DEFAULT_PORT;
}

async function findAvailablePort(startPort: number): Promise<number> {
  const hasExplicitPort = process.env.PORT !== undefined;
  const firstPortIsAvailable = await isPortAvailable(startPort);

  if (firstPortIsAvailable) {
    return startPort;
  }

  if (hasExplicitPort) {
    throw new Error(
      `Port ${startPort} is already in use. Set PORT to a different value or stop the process using that port.`,
    );
  }

  for (let attempt = 1; attempt < MAX_PORT_ATTEMPTS; attempt += 1) {
    const port = startPort + attempt;

    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(
    `Unable to find an available port between ${startPort} and ${startPort + MAX_PORT_ATTEMPTS - 1}.`,
  );
}

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const server = createServer()
      .once('error', (error: NodeJS.ErrnoException) => {
        if (error.code === 'EADDRINUSE') {
          resolve(false);
          return;
        }

        reject(error);
      })
      .once('listening', () => {
        server.close(() => resolve(true));
      });

    server.listen(port);
  });
}

bootstrap().catch((error: unknown) => {
  if (error instanceof Error) {
    logger.error(`Application failed to start: ${error.message}`, error.stack);
    process.exit(1);
    return;
  }

  logger.error('Application failed to start with an unknown error');
  process.exit(1);
});
