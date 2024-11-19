import * as dotenv from 'dotenv'; dotenv.config();
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicationModule } from './publication/publication.module';
import { AuthorModule } from './author/author.module';
import { StatsModule } from './stats/stats.module';
import { EmailModule } from './emails/email.module';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  	imports: [
		MongooseModule.forRoot(process.env.MONGODB_URL),
		PublicationModule,
		AuthorModule,
		StatsModule,
		EmailModule,
		AuthModule,
		FeedbackModule
  	],
  	controllers: [AppController],
  	providers: [AppService],
})
export class AppModule {}
