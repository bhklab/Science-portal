import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import * as dotenv from 'dotenv'; dotenv.config();


@Module({
	imports: [
		// KeycloakConnectModule.register({
		// 	authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL,
		// 	realm: process.env.KEYCLOAK_REALM,
		// 	clientId: process.env.KEYCLOAK_CLIENT_ID,
		// 	secret: process.env.KEYCLOAK_CLIENT_SECRET,
		// }),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
