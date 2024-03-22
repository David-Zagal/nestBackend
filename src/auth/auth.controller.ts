import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';

import { Users } from './entities/users.entity';

import { CreateUserDto, LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { Login } from './interfaces/login-response.interface';

@Controller('auth')
export class AuthController {

	constructor (private readonly authService: AuthService) {}

	@Post()
	create (@Body() createUserDto: CreateUserDto): Promise<Users> {
		return this.authService.create (createUserDto);
	}

	@Post('/login')
	login (@Body() loginUserDto: LoginUserDto): Promise<Login> {
		return this.authService.login (loginUserDto);
	}

	@Post('/register')
	register (@Body() registerUserDto: RegisterUserDto): Promise<Login> {
		return this.authService.register (registerUserDto);
	}

	@UseGuards(AuthGuard)
	@Get()
	findAll (@Request() req: Request): Promise<Users[]> {
		// const user = req['user'] as Users;
		// return user;
		return this.authService.findAll ();
	}

	@UseGuards(AuthGuard)
	@Get('/check-token')
	checkToken (@Request() req: Request): Login {
		const user = req['user'] as Users;
		return {
			user: user,
			token: this.authService.getJwtToken ({ id: user._id }),
		};
	}

	// @Get(':id')
	// findOne (@Param('id') id: string) {
	// 	return this.authService.findOne (+id);
	// }

	// @Patch(':id')
	// update (@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
	// 	return this.authService.update (+id, updateUserDto);
	// }

	// @Delete(':id')
	// remove (@Param('id') id: string) {
	// 	return this.authService.remove (+id);
	// }
}