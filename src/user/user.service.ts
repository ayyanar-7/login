import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { EmailService } from 'src/email/email.service';
import { UserTable } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserTable)
    private userRepository: Repository<UserTable>,
  ) {}

  async createUser(data: CreateUserDto): Promise<UserTable> {
    const user = this.userRepository.create(data);
    const userServiceJwt = new UserServiceJwt(this, new EmailService());
    await userServiceJwt.sendEmail(user.token);
    return this.userRepository.save(user);
  }

  async sendEmail(token: string){
    const userServiceJwt = new UserServiceJwt(this, new EmailService());
    await userServiceJwt.sendEmail(token);
  }

  
  async findByUsername(username: string): Promise<UserTable | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }
  
  async getAllUsers(): Promise<UserTable[]> {
    return this.userRepository.find();
  }

  async getUser(username: string) {
    return this.userRepository.findOne({ where: { username}});
  }

  async updateUser(id: number, data: UpdateUserDto){
    const user = await this.userRepository.findOne({where: { id }});
  
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    return await this.userRepository.update(id, data);
  }

  async deleteUser(username: string){
    await this.userRepository.softDelete({username: username})

    return this.userRepository.update(username, {deletedBy: 1})
  }
  
}
// ...
Injectable()
export class UserServiceJwt {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService
  ) {}
  private readonly secretKey = 'your-secret-key';
  
  async generateJwtToken(data: any) {
    try {
      return jwt.sign(data, this.secretKey);
    } catch (error) {
      console.error('Error signing JWT:', error);
      throw new Error('Failed to sign JWT');
    }
  }
  

  async findOne(username: string) {
    const user = await this.userService.getUser(username);
    return user;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  async sendEmail(data: any){
    try {
      console.log(data);
      await this.emailService.sendMail(data);
      return data;
    } catch (error) {
      return `Error sending email: ${error.message}`;
    }
  }
}
