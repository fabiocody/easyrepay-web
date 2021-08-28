import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {NestExpressApplication} from '@nestjs/platform-express';
import {Logger, ValidationPipe} from '@nestjs/common';
import {UtilsService} from './utils/utils.service';
import {ConfigService} from '@nestjs/config';
import {config} from './config';
import {existsSync} from 'fs';
import {serve as swaggerServe, setup as swaggerSetup} from 'swagger-ui-express';
import {load as loadYaml} from 'yamljs';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.use(compression());
    logReleaseInfo(app);
    useRequestLogging(app);
    setupSecurity(app);
    setupSwagger(app);
    setupAngularClient();
    await app.listen(getPort(app));
}

function getPort(app: NestExpressApplication): number {
    const configService = app.get(ConfigService);
    return configService.get<number>('PORT', 3000);
}

function useRequestLogging(app: NestExpressApplication): void {
    const logger = new Logger('Request');
    app.use(
        morgan('tiny', {
            stream: {
                write: message => logger.log(message.replace('\n', '')),
            },
        }),
    );
}

function logReleaseInfo(app: NestExpressApplication): void {
    const utilsService = app.get(UtilsService);
    new Logger('Environment').log(utilsService.getEnvironment());
    new Logger('ReleaseInfo').log(JSON.stringify(utilsService.getReleaseInfo()));
}

function setupSecurity(app: NestExpressApplication): void {
    const logger = new Logger('Security');
    const allowedOrigins = ['https://easyrepay.fabiocodiglioni.ovh', 'easyrepay.fabiocodiglioni.ovh'];
    const utilsService = app.get(UtilsService);
    app.use(
        helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrcAttr: ["'self'", "'unsafe-inline'"],
                },
            },
        }),
    );
    app.use((req, _, next) => {
        req.headers.origin = req.headers.origin ?? req.headers.host;
        next();
    });
    app.enableCors({
        origin: (origin, callback) => {
            if (utilsService.isDev()) {
                callback(null);
            } else if (!origin) {
                logger.warn('No origin');
                callback(null);
            } else if (origin && allowedOrigins.includes(origin)) {
                callback(null, origin);
            } else {
                callback(new Error(`Origin ${origin} not allowed`));
            }
        },
    });
    app.use(rateLimit({windowMs: 1000, max: 50}));
}

function setupSwagger(app: NestExpressApplication): void {
    const logger = new Logger('SwaggerUI');
    try {
        for (const swaggerFile of config.swaggerFiles) {
            if (existsSync(swaggerFile)) {
                logger.log(`Found swagger file at ${swaggerFile}`);
                const swaggerDoc = loadYaml(swaggerFile);
                app.use('/api-docs', swaggerServe, swaggerSetup(swaggerDoc));
                return;
            } else {
                logger.warn('No swagger.yaml file found');
            }
        }
    } catch (error) {
        logger.error(error);
    }
}

function setupAngularClient(): void {
    const logger = new Logger('AngularApp');
    if (existsSync(config.angularPath)) {
        logger.log('Serving Angular app');
    } else {
        logger.warn('Skipping Angular app');
    }
}

bootstrap().then();
