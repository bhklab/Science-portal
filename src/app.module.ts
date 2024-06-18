import * as dotenv from 'dotenv'; dotenv.config();
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicationModule } from './publication/publication.module';
import { AuthorModule } from './author/author.module';
import { StatsModule } from './stats/stats.module';
@Module({
  imports: [
	MongooseModule.forRoot(process.env.MONGODB_URL),
	PublicationModule,
	AuthorModule,
	StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
