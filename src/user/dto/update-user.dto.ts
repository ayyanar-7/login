import { PartialType } from '@nestjs/mapped-types';
import { CreateLoginDto, CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiProperty()
    @IsString()
    username?: string;

    @ApiProperty()
    password?: string;

    @ApiProperty()
    isVerified?: number;
}

export class forgotDto extends PartialType(CreateLoginDto) {
    @ApiProperty()
    username: string;

    @ApiProperty()
    newPassword: string;

    @ApiProperty()
    reEnterPassword: string;
}

