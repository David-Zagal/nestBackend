import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Users, UsersSchema } from './entities/users.entity';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		ConfigModule.forRoot (),
		MongooseModule.forFeature ([
			{ name: Users.name, schema: UsersSchema },
		]),
		JwtModule.register ({
			global: true,
			secret: process.env.JWT_SEED,
			signOptions: { expiresIn: '6h' },
		}),
	],
})
export class AuthModule {}