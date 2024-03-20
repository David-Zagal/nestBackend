import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';

import * as bycryptjs from 'bcryptjs';

import { CreateUserDto, LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { Users } from './entities/users.entity';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Login } from './interfaces/login-response.interface';

@Injectable()
export class AuthService {

	constructor (@InjectModel (Users.name) private usersModel: Model<Users>, private jwtService: JwtService) {}

	async create (createUserDto: CreateUserDto): Promise<Users> {
		try {
			const { password, ...userData } = createUserDto;
			// 1. Encriptar la contraseña
			const createdUser = new this.usersModel ({
				password: bycryptjs.hashSync (password, 10),
				...userData,
			});
			// 2. Guardar el usuario y evitar que regrese el password
			await createdUser.save ();
			const { password: _, ...user } = createdUser.toJSON ();
			return user;
			// 3. Generar el JWT (Jason Web Token)
		} catch (error) {
			// 4. Manejo de errores
			if (error.code === 11000) throw new BadRequestException (`${ createUserDto.email } already exist!`);
			throw new InternalServerErrorException ('Something terrible happend!');
		}
	}

	async login (loginUserDto: LoginUserDto): Promise<Login> {
		// console.log ({ loginUserDto });
		const { email, password } = loginUserDto;
		const user = await this.usersModel.findOne ({ email });
		if (!user) throw new UnauthorizedException ('Not valid credentials - email');
		
		if (!bycryptjs.compareSync (password, user.password)) throw new UnauthorizedException ('Not valid credentials - password');
		const { password: _, ...rest } = user.toJSON ();
		return {
			user: rest,
			token: this.getJwtToken ({ id: user.id }),
		};
	}
	
	async register (registerUserDto: RegisterUserDto): Promise<Login> {
		// console.log ({ registerUserDto });
		const user = await this.create (registerUserDto);
		return {
			user: user,
			token: this.getJwtToken ({ id: user._id }),
		};
	}

	findAll (): Promise<Users[]> {
		return this.usersModel.find ();
	}

	async findUserById (id: string): Promise<Users> {
		const user = await this.usersModel.findById (id);
		const { password, ...rest } = user.toJSON ();
		return rest;
	}

	findOne (id: number): string {
		return `This action returns a #${ id } auth`;
	}

	update (id: number, updateUserDto: UpdateUserDto): string {
		return `This action updates a #${ id } auth`;
	}

	remove (id: number): string {
		return `This action removes a #${ id } auth`;
	}

	getJwtToken (payload: JwtPayload): string {
		const token = this.jwtService.sign (payload);
		return token;
	}
}