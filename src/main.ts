import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('JK Tech Api Documentation') // API title
    .setDescription('The Jk Tech API description') // API description
    .setVersion('1.0') // API version
    .addTag('Jk Tech apis') // Add tags for categorization (optional)
    .addBearerAuth()
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Serve the Swagger UI at the /api endpoint
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
