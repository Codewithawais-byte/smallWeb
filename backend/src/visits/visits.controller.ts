import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { VisitVia } from '../schemas/visit.schema';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Post()
  record(@Body() body: { personId: string; address: string; via: VisitVia }) {
    return this.visits.record(body);
  }

  @Get()
  history(@Query('personId') personId: string) {
    return this.visits.historyFor(personId);
  }
}
