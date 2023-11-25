import { Module } from '@nestjs/common';
import { UserService, UserServiceJwt } from './user.service';
import { LoginController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailService } from 'src/email/email.service';
import { UserTable } from './entities/user.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      UserTable
    ]),
    PassportModule,
    JwtModule.register({
      secret: 'your-secret-key', // Replace with a strong, random secret key
      signOptions: { expiresIn: '1h' }, // Set the expiration time for the token
    }),
  ],
  controllers: [LoginController],
  providers: [UserService, UserServiceJwt, EmailService],
})
export class UserModule {}
