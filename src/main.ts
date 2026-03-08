import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { createServer } from 'node:net';
import { AppModule } from './app.module';
import { APP_CONSTANTS } from './common/constants/app.constants';

const logger = new Logger('Bootstrap');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const preferredPort = getPreferredPort(configService);
  logger.log(`Starting application with preferred port ${preferredPort}`);

  app.enableCors({
    origin:
      configService.get<string>('FRONTEND_URL') ??
      APP_CONSTANTS.DEFAULT_FRONTEND_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle(APP_CONSTANTS.SWAGGER_TITLE)
    .setDescription(APP_CONSTANTS.SWAGGER_DESCRIPTION)
    .setVersion(APP_CONSTANTS.SWAGGER_VERSION)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(APP_CONSTANTS.SWAGGER_PATH, app, document);

  const port = await findAvailablePort(preferredPort, configService);

  if (port !== preferredPort) {
    logger.warn(
      `Port ${preferredPort} is unavailable. Falling back to ${port}`,
    );
  }

  await app.listen(port);
  logger.log(`Application is running on ${await app.getUrl()}`);
}

function getPreferredPort(configService: ConfigService): number {
  const portValue = configService.get<string>('PORT');

  if (portValue === undefined) {
    return APP_CONSTANTS.DEFAULT_PORT;
  }

  const parsedPort = Number.parseInt(portValue, 10);

  return Number.isInteger(parsedPort) && parsedPort > 0
    ? parsedPort
    : APP_CONSTANTS.DEFAULT_PORT;
}

async function findAvailablePort(
  startPort: number,
  configService: ConfigService,
): Promise<number> {
  const hasExplicitPort = configService.get<string>('PORT') !== undefined;
  const firstPortIsAvailable = await isPortAvailable(startPort);

  if (firstPortIsAvailable) {
    return startPort;
  }

  if (hasExplicitPort) {
    throw new Error(
      `Port ${startPort} is already in use. Set PORT to a different value or stop the process using that port.`,
    );
  }

  for (
    let attempt = 1;
    attempt < APP_CONSTANTS.MAX_PORT_ATTEMPTS;
    attempt += 1
  ) {
    const port = startPort + attempt;
    if (await isPortAvailable(port)) {
      return port;
    }
  }

  throw new Error(
    `Unable to find an available port between ${startPort} and ${startPort + APP_CONSTANTS.MAX_PORT_ATTEMPTS - 1}.`,
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
