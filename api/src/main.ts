import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // SSL sertifikalarını yükle
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '../ssl/private-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../ssl/public-cert.pem')),
  };

  // HTTPS ile uygulama oluştur
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  // SSL doğrulama dosyası için statik klasör ayarla
  app.use('/.well-known/pki-validation', express.static(path.join(__dirname, '.well-known/pki-validation')));

  // CORS ayarları
  app.enableCors({
    origin: ['https://flow360.tr', 'http://flow360.tr', 'https://18.198.243.156'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
    exposedHeaders: 'Authorization',
  });

  // Swagger yapılandırması
  const config = new DocumentBuilder()
    .setTitle('Flow360 API')
    .setDescription('Flow360 REST API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 443;
  await app.listen(port);
  logger.log(`Uygulama HTTPS üzerinden ${port} portunda çalışıyor`);
}
bootstrap();
