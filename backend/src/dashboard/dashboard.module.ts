import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment, Intervention, User } from '../entities';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Enrollment, Intervention])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
