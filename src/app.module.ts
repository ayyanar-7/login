import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:'.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: false,
      autoLoadEntities: true,
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
