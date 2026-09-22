import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Visit, VisitVia } from '../schemas/visit.schema';
import { SitesService } from '../sites/sites.service';

@Injectable()
export class VisitsService {
  constructor(
    @InjectModel(Visit.name) private visitModel: Model<Visit>,
    private readonly sites: SitesService,
  ) {}

  // Record a navigation. Recorded even for dead addresses — a failed
  // visit is still a fact about where you went.
  async record(params: { personId: string; address: string; via: VisitVia }) {
    const address = params.address.toLowerCase().trim();
    const site = await this.sites.findByAddress(address);
    return this.visitModel.create({
      personId: new Types.ObjectId(params.personId),
      address,
      resolvedSiteId: site ? site._id : null,
      via: params.via,
      at: new Date(),
    });
  }

  // The persisted, scrollable, jumpable history — independent of
  // whatever back/forward stack the client currently holds.
  async historyFor(personId: string, limit = 200) {
    return this.visitModel
      .find({ personId: new Types.ObjectId(personId) })
      .sort({ at: -1 })
      .limit(limit);
  }
}
