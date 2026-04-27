import { Controller, Get, Param } from '@nestjs/common';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  getEmployeeProfile(@Param('userId') userId: string) {
    return this.profilesService.getEmployeeProfile(userId);
  }
}
