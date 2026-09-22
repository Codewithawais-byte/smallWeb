import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Visit, VisitSchema } from '../schemas/visit.schema';
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';
import { SitesModule } from '../sites/sites.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]),
    SitesModule,
  ],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}
