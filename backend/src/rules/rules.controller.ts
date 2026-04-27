import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@ApiTags('rules')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  @Roles('admin', 'hr', 'manager')
  findAll() {
    return this.rulesService.findAll();
  }

  @Post()
  @Roles('admin', 'hr')
  create(@Body() payload: CreateRuleDto) {
    return this.rulesService.create(payload);
  }

  @Patch(':id')
  @Roles('admin', 'hr')
  update(@Param('id') id: string, @Body() payload: UpdateRuleDto) {
    return this.rulesService.update(id, payload);
  }

  @Patch(':id/activate')
  @Roles('admin', 'hr')
  activate(@Param('id') id: string) {
    return this.rulesService.setActive(id, true);
  }

  @Patch(':id/deactivate')
  @Roles('admin', 'hr')
  deactivate(@Param('id') id: string) {
    return this.rulesService.setActive(id, false);
  }
}
