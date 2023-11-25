import { Controller, UseGuards, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, Put, Res } from '@nestjs/common';
import { UserService, UserServiceJwt } from './user.service';
import { CreateLoginDto, CreateUserDto, VerifyDto } from './dto/create-user.dto';
import { forgotDto } from './dto/update-user.dto';
import { Request, Response } from 'express';

@Controller('Registeration')
export class LoginController {
  constructor(private readonly userService: UserService,
     private readonly userServiceJwt: UserServiceJwt,
     ) {}
     
     @Post('signup')
     async signup(@Req() req: Request, @Res() res: Response, @Body() data: CreateUserDto) {
       try {
         data.password = await this.userServiceJwt.hashPassword(data.password);
         data['token'] = await this.userServiceJwt.generateJwtToken(data);
        
         const user = await this.userService.createUser(data);
         
         res.status(HttpStatus.OK).json({
           message: 'User created successfully',
           data: user,
         });
       } catch (error) {
         console.log(error);
         res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
           message: 'Something went wrong',
         });
       }
     }
     

  @Post("login")
  async login(@Req() req: Request, @Res() res: Response, @Body() loginInfo: CreateLoginDto) {
    try {
      const user = await this.userService.findByUsername(loginInfo.username);

      if (!user) {
        return res.status(HttpStatus.OK).json({
          message: 'Invalid username!',
        });
      }

      if (!await this.userServiceJwt.comparePasswords(loginInfo.password, user.password)) {
        return res.status(HttpStatus.OK).json({
          message: 'Invalid password!',
        });
      }

      if (user.isVerified !== 1) {
        return res.status(HttpStatus.OK).json({
          message: 'User Not verified!',
        });
      }

      return res.status(HttpStatus.OK).json({
        message: 'Successfully logged in!',
        data: user,
      });

    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: `Something went wrong: ${e.message}`,
      });
    }
  }


@Put('verification/:username')
async verification(@Req() req: Request, @Res() res: Response, @Body() data: VerifyDto) {
  try {
    const obj = await this.userService.getUser(data.username);
    if(!obj){
      return "Invalid Username";
    }
    if(!await this.userServiceJwt.comparePasswords(data.password, obj.password)){
      return "Invalid Password!"
    }
    if(data.token != obj.token){
      return "Invalid token!"
    }
    obj.isVerified = 1;
    obj.token = null;
    await this.userService.updateUser(obj.id, obj);
    res.status(HttpStatus.OK).json({
      message: 'User Successfully Verified!'
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong!',
    });
  }
}

@Put('forgotPassword/:username')
async forgotPassword(@Req() req: Request, @Res() res: Response, @Body() data: forgotDto) {
  try {
    const obj = await this.userService.getUser(data.username);
    if(!obj){
      return "Invalid Username"
    }
    if(obj.isVerified != 1){
      return "User does not verified!"
    }
    if(data.newPassword != data.reEnterPassword){
      return "Password does not match!"
    }

    obj.password = await this.userServiceJwt.hashPassword(data.newPassword);
    obj['token'] = await this.userServiceJwt.generateJwtToken(data);
    obj.isVerified = 0;

    await this.userService.sendEmail(obj.token);
    
    await this.userService.updateUser(obj.id, obj);
    res.status(HttpStatus.OK).json({
      message: 'User password successfully updated!'
    });
  } catch (error) {
    console.log(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Something went wrong!',
    });
  }
}
  

}


// @Controller('users') // assuming your endpoint is '/users'
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Get('getAllUsers')
//   async getAllUsers(@Res() res: Response) {
//     try {
//       const users = await this.userService.getAllUsers();
//       res.status(HttpStatus.OK).json({
//         message: 'Users retrieved successfully',
//         data: users,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         message: 'Something went wrong',
//       });
//     }
//   }

//   @Get('getUser/:username')
//   async getUser(@Res() res: Response, @Param('username') username: string) {
//     try {
//       const user = await this.userService.getUser(username);
//       if (!user) {
//         res.status(HttpStatus.NOT_FOUND).json({
//           message: 'User not found',
//         });
//         return;
//       }
//       res.status(HttpStatus.OK).json({
//         message: 'User retrieved successfully',
//         data: user,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         message: 'Something went wrong',
//       });
//     }
//   }

//   @Put('update/:username')
//   async updateUser(@Req() req: Request, @Res() res: Response, @Param('username') username: string, @Body() data: UpdateUserDto) {
//     try {
//       const user = await this.userService.updateUser(username, data);
//       res.status(HttpStatus.OK).json({
//         message: 'User updated successfully',
//         data: user,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         message: 'Something went wrong',
//       });
//     }
//   }

//   @Delete('delete/:username')
//   async deleteUser(@Res() res: Response, @Param('username') username: string) {
//     try {
//       const user = await this.userService.deleteUser(username);
//       res.status(HttpStatus.OK).json({
//         message: 'User deleted successfully',
//         data: user,
//       });
//     } catch (error) {
//       console.log(error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         message: 'Something went wrong',
//       });
//     }
//   }
// }