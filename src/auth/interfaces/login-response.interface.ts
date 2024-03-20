import { Users } from "../entities/users.entity";

export interface Login {
	user: Users;
	token: string;
}