import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoginController } from './user/user.controller';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Simple CRUD API')
  .setDescription('CRUD Using NestJS and MySQL') .
  setVersion('1.0')
  .addTag('CRUD') .build();
  const document = SwaggerModule.createDocument(app, config); 
  SwaggerModule.setup('api', app, document);
  
  await app.listen(3000,()=>{
    console.log('Server is running on port 3000');
  });
}
bootstrap();
