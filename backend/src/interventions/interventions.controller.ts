import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { InterventionsService } from './interventions.service';
import type { CreateInterventionDto } from './dto/create-intervention.dto';
import type { UpdateInterventionDto } from './dto/update-intervention.dto';

@Controller('interventions')
export class InterventionsController {
  constructor(private readonly interventionsService: InterventionsService) {}

  @Get()
  list(@Query('status') status?: string) {
    return this.interventionsService.list(status);
  }

  @Get('summary')
  summary() {
    return this.interventionsService.summary();
  }

  @Post()
  create(@Body() payload: CreateInterventionDto) {
    return this.interventionsService.create(payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateInterventionDto) {
    return this.interventionsService.update(id, payload);
  }

  @Patch(':id/close')
  close(
    @Param('id') id: string,
    @Body() body: { outcomeNotes?: string; postInterventionScore?: number },
  ) {
    return this.interventionsService.close(id, body.outcomeNotes, body.postInterventionScore);
  }
}
