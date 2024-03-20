import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Users {

	// @Prop()
	_id?: string;

	@Prop({ unique: true, required: true })
	email: string;

	@Prop({ required: true })
	name: string;

	@Prop({ minlength: 6, required: true })
	password?: string;

	@Prop({ default: true })
	isActive: boolean;

	@Prop({ type: [String], default: ['user'] }) // ['user', 'admin']
	roles: string[];
}

export const UsersSchema = SchemaFactory.createForClass (Users);