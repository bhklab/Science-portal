import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv'; dotenv.config();


@Injectable()
export class AuthService {
  async login(username: string, password: string) {
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
  }
}
