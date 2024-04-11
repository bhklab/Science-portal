import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicationModule } from './publication/publication.module';
console.log(process.env.MONGODB_URL);
@Module({
  imports: [
	MongooseModule.forRoot(process.env.MONGODB_URL),
	PublicationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
