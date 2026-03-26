import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KeycloakConnectModule } from 'nest-keycloak-connect';
import * as dotenv from 'dotenv'; dotenv.config();


@Module({
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
