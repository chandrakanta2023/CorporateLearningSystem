import { Injectable } from '@nestjs/common';
import { ProfilesService } from '../profiles/profiles.service';

@Injectable()
export class DashboardService {
  constructor(private readonly profilesService: ProfilesService) {}

  getSummary() {
    return this.profilesService.getDashboardSummary();
  }
}
