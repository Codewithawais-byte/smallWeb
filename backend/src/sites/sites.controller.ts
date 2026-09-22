import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { SitesService } from './sites.service';

@Controller('sites')
export class SitesController {
  constructor(private readonly sites: SitesService) {}

  // GET /sites/search?q=... comes before :address so it isn't
  // swallowed by the dynamic route below.
  @Get('search')
  search(@Query('q') q: string) {
    if (!q) return [];
    return this.sites.search(q);
  }

  @Get(':address')
  async getByAddress(@Param('address') address: string) {
    const site = await this.sites.findByAddress(address);
    if (!site) throw new NotFoundException(`No site at "${address}"`);
    return site;
  }

  @Post()
  publish(
    @Body() body: { address: string; title: string; body: string; authorId: string },
  ) {
    return this.sites.publish(body);
  }
}
