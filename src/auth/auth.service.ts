import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import { UserDocument } from '../interfaces/user.interface';

@Injectable()
export class AuthService {
	constructor(
			@InjectModel('User') private UserModel: Model<UserDocument>,
	) {}
  	async login(username: string, password: string) {
		if (process.env.KEYCLOAK_USAGE.toLowerCase() === 'true') {
			try {
				// Send request to Keycloak token endpoint
				const response = await axios.post(
					process.env.KEYCLOAK_PWD_SIGN_ON,
					{
					client_id: process.env.KEYCLOAK_CLIENT_ID,
					grant_type: 'password',
					client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
					username,
					password,
					},
					{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					},
				);

				// Log response data for debugging
				console.log('Token response:', response.data);

				const { access_token } = response.data;

				// Decode the access token to get user information
				const decodedToken = jwt.decode(access_token);

				console.log('Decoded Token:', decodedToken);

				// Return the access token along with decoded user info
				return {
					access_token,
					user_info: decodedToken,
				};
				} catch (error) {
				// Log error details for debugging
				console.error('Error during login:', error);
				
				// Throw an HTTP exception with a 401 Unauthorized status
				throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
			}
		} else {
			const user = await this.UserModel.findOne({ email: username });

			if (!user) {
				throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
			}

			const verdict = await bcrypt.compare(password, user.password);

			if (!verdict) {
				throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
			}

			const payload = {
				name: `${user.lastName}, ${user.firstName}`,
				email: user.email,
				admin: user.admin,
			};

			const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
				expiresIn: '18h',
			});

			const decodedToken = jwt.decode(access_token);
			console.log(decodedToken)

			return {
				access_token,
				user_info: decodedToken,
			};
		}
	}
}