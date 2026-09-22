import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SitesModule } from './sites/sites.module';
import { PeopleModule } from './people/people.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/small-web',
    ),
    SitesModule,
    PeopleModule,
    VisitsModule,
  ],
})
export class AppModule {}
