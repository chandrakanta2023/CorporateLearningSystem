import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RiskRule } from '../entities/risk-rule.entity';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([RiskRule])],
  controllers: [RulesController],
  providers: [RulesService],
  exports: [RulesService],
})
export class RulesModule {}
