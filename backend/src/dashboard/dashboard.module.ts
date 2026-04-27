import { Module } from '@nestjs/common';
import { ProfilesModule } from '../profiles/profiles.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [ProfilesModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
