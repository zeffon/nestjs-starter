import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/exception'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { SuccessResponseInterceptor } from './common/interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  )

  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new SuccessResponseInterceptor(),
  )

  const configService = app.get(ConfigService)
  if (configService.get('ENV') === 'development') {
    const options = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('nestjs-starter API-Docs')
      .setDescription('The nestjs-starter API Documents')
      .setVersion('1.0')
      .addTag('nestjs-starter')
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('api-docs', app, document)
  }

  await app.listen(configService.get('PORT'))
}

bootstrap()
