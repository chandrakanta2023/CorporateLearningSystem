import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RulesService } from './rules.service';
import type { CreateRuleDto } from './dto/create-rule.dto';
import type { UpdateRuleDto } from './dto/update-rule.dto';

@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  findAll() {
    return this.rulesService.findAll();
  }

  @Post()
  create(@Body() payload: CreateRuleDto) {
    return this.rulesService.create(payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateRuleDto) {
    return this.rulesService.update(id, payload);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.rulesService.setActive(id, true);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.rulesService.setActive(id, false);
  }
}
